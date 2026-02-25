import { supabase } from '../supabase';

export interface CommunityTopic {
  id: string;
  title: string;
  members: number;
  posts: number;
  description: string;
  color: string;
  icon: string;
  online?: number;
}

export interface CommunityPost {
  id: string;
  communityId: string;
  author: string;
  authorBadge?: string;
  title: string;
  content: string;
  upvotes: number;
  comments: number;
  views: number;
  time: string;
  isPinned?: boolean;
  flair?: string;
  hasUpvoted?: boolean;
  created_at?: string;
}

export interface CommunityComment {
  id: string;
  author: string;
  authorBadge?: string;
  content: string;
  upvotes: number;
  time: string;
  hasUpvoted?: boolean;
  replies?: CommunityComment[];
  parent_id?: string | null;
}

function formatTimeAgo(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const sec = Math.floor((now.getTime() - d.getTime()) / 1000);
  if (sec < 60) return 'just now';
  if (sec < 3600) return `${Math.floor(sec / 60)}m ago`;
  if (sec < 86400) return `${Math.floor(sec / 3600)}h ago`;
  if (sec < 604800) return `${Math.floor(sec / 86400)}d ago`;
  if (sec < 2592000) return `${Math.floor(sec / 604800)}w ago`;
  return `${Math.floor(sec / 2592000)}mo ago`;
}

export async function fetchCommunityTopics(): Promise<CommunityTopic[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('community_topics')
    .select('*')
    .order('title');

  if (error) {
    console.error('Failed to fetch topics:', error);
    return [];
  }

  return (data ?? []).map((t) => ({
    id: t.id,
    title: t.title,
    members: t.members_count ?? 0,
    posts: t.posts_count ?? 0,
    description: t.description ?? '',
    color: t.color ?? '#F487B6',
    icon: t.icon ?? '💬',
    online: t.online_count ?? undefined,
  }));
}

export async function fetchCommunityPosts(
  topicId: string,
  userId?: string | null
): Promise<CommunityPost[]> {
  if (!supabase) return [];

  const { data: posts, error } = await supabase
    .from('community_posts')
    .select(`
      id,
      topic_id,
      author_name,
      author_badge,
      created_at,
      title,
      content,
      upvotes,
      views,
      is_pinned,
      flair
    `)
    .eq('topic_id', topicId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to fetch posts:', error);
    return [];
  }

  // Get comment counts
  const postIds = (posts ?? []).map((p) => p.id);
  const { data: counts } = await supabase
    .from('community_comments')
    .select('post_id')
    .in('post_id', postIds);

  const commentCountMap: Record<string, number> = {};
  for (const c of counts ?? []) {
    commentCountMap[c.post_id] = (commentCountMap[c.post_id] ?? 0) + 1;
  }

  // Get user's upvotes if authenticated
  let upvotedPostIds: Set<string> = new Set();
  if (userId) {
    const { data: upvotes } = await supabase
      .from('post_upvotes')
      .select('post_id')
      .eq('user_id', userId)
      .in('post_id', postIds);
    upvotedPostIds = new Set((upvotes ?? []).map((u) => u.post_id));
  }

  return (posts ?? []).map((p) => ({
    id: p.id,
    communityId: p.topic_id,
    author: p.author_name,
    authorBadge: p.author_badge ?? undefined,
    title: p.title,
    content: p.content,
    upvotes: p.upvotes ?? 0,
    comments: commentCountMap[p.id] ?? 0,
    views: p.views ?? 0,
    time: formatTimeAgo(p.created_at),
    isPinned: p.is_pinned,
    flair: p.flair ?? undefined,
    hasUpvoted: upvotedPostIds.has(p.id),
    created_at: p.created_at,
  }));
}

export async function fetchPostComments(
  postId: string,
  userId?: string | null
): Promise<CommunityComment[]> {
  if (!supabase) return [];

  const { data: comments, error } = await supabase
    .from('community_comments')
    .select('id, author_name, author_badge, parent_id, created_at, content, upvotes')
    .eq('post_id', postId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Failed to fetch comments:', error);
    return [];
  }

  let upvotedIds: Set<string> = new Set();
  if (userId && (comments ?? []).length > 0) {
    const ids = (comments ?? []).map((c) => c.id);
    const { data: upvotes } = await supabase
      .from('comment_upvotes')
      .select('comment_id')
      .eq('user_id', userId)
      .in('comment_id', ids);
    upvotedIds = new Set((upvotes ?? []).map((u) => u.comment_id));
  }

  const flat = (comments ?? []).map((c) => ({
    id: c.id,
    author: c.author_name,
    authorBadge: c.author_badge ?? undefined,
    content: c.content,
    upvotes: c.upvotes ?? 0,
    time: formatTimeAgo(c.created_at),
    hasUpvoted: upvotedIds.has(c.id),
    parent_id: c.parent_id,
  }));

  // Build tree (top-level only for now; replies can be added later)
  const byParent: Record<string, CommunityComment[]> = {};
  const roots: CommunityComment[] = [];
  for (const c of flat) {
    const node: CommunityComment = {
      id: c.id,
      author: c.author,
      authorBadge: c.authorBadge,
      content: c.content,
      upvotes: c.upvotes,
      time: c.time,
      hasUpvoted: c.hasUpvoted,
    };
    if (c.parent_id) {
      if (!byParent[c.parent_id]) byParent[c.parent_id] = [];
      byParent[c.parent_id].push(node);
    } else {
      roots.push(node);
    }
  }
  // Attach replies
  function attachReplies(nodes: CommunityComment[]) {
    for (const n of nodes) {
      if (byParent[n.id]?.length) {
        n.replies = byParent[n.id];
        attachReplies(n.replies);
      }
    }
  }
  attachReplies(roots);
  return roots;
}

export async function createPost(
  topicId: string,
  authorId: string,
  authorName: string,
  authorBadge: string | null,
  title: string,
  content: string,
  flair?: string
): Promise<string | null> {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('community_posts')
    .insert({
      topic_id: topicId,
      author_id: authorId,
      author_name: authorName,
      author_badge: authorBadge,
      title,
      content,
      flair: flair ?? null,
    })
    .select('id')
    .single();

  if (error) {
    console.error('Failed to create post:', error);
    return null;
  }

  const { data: topic } = await supabase
    .from('community_topics')
    .select('posts_count')
    .eq('id', topicId)
    .single();
  await supabase
    .from('community_topics')
    .update({ posts_count: (topic?.posts_count ?? 0) + 1 })
    .eq('id', topicId);
  return data?.id ?? null;
}

export async function createComment(
  postId: string,
  authorId: string,
  authorName: string,
  authorBadge: string | null,
  content: string,
  parentId?: string | null
): Promise<string | null> {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('community_comments')
    .insert({
      post_id: postId,
      author_id: authorId,
      author_name: authorName,
      author_badge: authorBadge,
      content,
      parent_id: parentId ?? null,
    })
    .select('id')
    .single();

  if (error) {
    console.error('Failed to create comment:', error);
    return null;
  }
  return data?.id ?? null;
}

export async function togglePostUpvote(postId: string, userId: string): Promise<boolean> {
  if (!supabase) return false;

  const { data: existing } = await supabase
    .from('post_upvotes')
    .select('id')
    .eq('post_id', postId)
    .eq('user_id', userId)
    .maybeSingle();

  if (existing) {
    await supabase.from('post_upvotes').delete().eq('post_id', postId).eq('user_id', userId);
    const { data: post } = await supabase.from('community_posts').select('upvotes').eq('id', postId).single();
    await supabase
      .from('community_posts')
      .update({ upvotes: Math.max(0, (post?.upvotes ?? 1) - 1) })
      .eq('id', postId);
    return false;
  } else {
    await supabase.from('post_upvotes').insert({ post_id: postId, user_id: userId });
    const { data: post } = await supabase.from('community_posts').select('upvotes').eq('id', postId).single();
    await supabase
      .from('community_posts')
      .update({ upvotes: (post?.upvotes ?? 0) + 1 })
      .eq('id', postId);
    return true;
  }
}

export async function toggleCommentUpvote(commentId: string, userId: string): Promise<boolean> {
  if (!supabase) return false;

  const { data: existing } = await supabase
    .from('comment_upvotes')
    .select('id')
    .eq('comment_id', commentId)
    .eq('user_id', userId)
    .maybeSingle();

  if (existing) {
    await supabase.from('comment_upvotes').delete().eq('comment_id', commentId).eq('user_id', userId);
    const { data: comment } = await supabase
      .from('community_comments')
      .select('upvotes')
      .eq('id', commentId)
      .single();
    await supabase
      .from('community_comments')
      .update({ upvotes: Math.max(0, (comment?.upvotes ?? 1) - 1) })
      .eq('id', commentId);
    return false;
  } else {
    await supabase.from('comment_upvotes').insert({ comment_id: commentId, user_id: userId });
    const { data: comment } = await supabase
      .from('community_comments')
      .select('upvotes')
      .eq('id', commentId)
      .single();
    await supabase
      .from('community_comments')
      .update({ upvotes: (comment?.upvotes ?? 0) + 1 })
      .eq('id', commentId);
    return true;
  }
}
