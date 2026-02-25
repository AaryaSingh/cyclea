import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import {
  fetchCommunityTopics,
  fetchCommunityPosts,
  fetchPostComments,
  createPost as createPostApi,
  createComment as createCommentApi,
  togglePostUpvote as togglePostUpvoteApi,
  toggleCommentUpvote as toggleCommentUpvoteApi,
  type CommunityTopic,
  type CommunityPost,
  type CommunityComment,
} from '../lib/supabase/community';

// Fallback mock topics when Supabase not configured
export const MOCK_TOPICS: CommunityTopic[] = [
  { id: 'pcos', title: 'PCOS Support', members: 12400, posts: 890, description: 'Share experiences and management strategies for PCOS', color: '#F487B6', icon: '🎀', online: 234 },
  { id: 'endo', title: 'Endometriosis Warriors', members: 8900, posts: 1240, description: 'Connect with others managing endometriosis', color: '#9E6B8E', icon: '💜', online: 156 },
  { id: 'ibs', title: 'IBS & Gut Health', members: 15200, posts: 2100, description: 'Discuss digestive health and cycle-related GI symptoms', color: '#4FB0AE', icon: '🌿', online: 389 },
  { id: 'ttc', title: 'Trying to Conceive', members: 10500, posts: 3400, description: 'Support for fertility journey and cycle tracking', color: '#C59FA8', icon: '🤰', online: 278 },
  { id: 'perimenopause', title: 'Perimenopause & Menopause', members: 6700, posts: 780, description: 'Navigate hormonal transitions together', color: '#FFC0D3', icon: '🌸', online: 123 },
  { id: 'mental-health', title: 'Mental Health & Hormones', members: 9200, posts: 1560, description: 'Discuss PMDD, anxiety, and mood changes', color: '#69C9C0', icon: '🧠', online: 198 },
];

export function useCommunityTopics() {
  const [topics, setTopics] = useState<CommunityTopic[]>(MOCK_TOPICS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isSupabaseConfigured()) {
      setLoading(true);
      fetchCommunityTopics()
        .then((t) => {
          if (t.length > 0) setTopics(t);
        })
        .finally(() => setLoading(false));
    }
  }, []);

  return { topics, loading };
}

export function useTopicPosts(topicId: string | null, userId: string | null) {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!topicId) {
      setPosts([]);
      return;
    }
    if (isSupabaseConfigured()) {
      setLoading(true);
      fetchCommunityPosts(topicId, userId)
        .then(setPosts)
        .finally(() => setLoading(false));
    } else {
      setPosts([]);
    }
  }, [topicId, userId]);

  // Real-time: subscribe to new posts in this topic
  useEffect(() => {
    if (!supabase || !topicId) return;
    const channel = supabase
      .channel(`posts:${topicId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'community_posts', filter: `topic_id=eq.${topicId}` },
        () => {
          fetchCommunityPosts(topicId, userId).then(setPosts);
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'community_posts', filter: `topic_id=eq.${topicId}` },
        () => {
          fetchCommunityPosts(topicId, userId).then(setPosts);
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [topicId, userId]);

  return { posts, loading };
}

export function usePostComments(postId: string | null, userId: string | null) {
  const [comments, setComments] = useState<CommunityComment[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!postId) {
      setComments([]);
      return;
    }
    if (isSupabaseConfigured()) {
      setLoading(true);
      fetchPostComments(postId, userId)
        .then(setComments)
        .finally(() => setLoading(false));
    } else {
      setComments([]);
    }
  }, [postId, userId]);

  // Real-time: subscribe to new/updated comments on this post
  useEffect(() => {
    if (!supabase || !postId) return;
    const channel = supabase
      .channel(`comments:${postId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'community_comments', filter: `post_id=eq.${postId}` },
        () => {
          fetchPostComments(postId, userId).then(setComments);
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [postId, userId]);

  return { comments, setComments, loading };
}

export function useCommunityActions(userId: string | null) {
  return {
    createPost: useCallback(
      (topicId: string, title: string, content: string, flair?: string) =>
        userId
          ? createPostApi(topicId, userId, 'Anonymous', null, title, content, flair)
          : Promise.resolve(null),
      [userId]
    ),
    createComment: useCallback(
      (postId: string, content: string, parentId?: string | null) =>
        userId
          ? createCommentApi(postId, userId, 'Anonymous', null, content, parentId)
          : Promise.resolve(null),
      [userId]
    ),
    togglePostUpvote: useCallback(
      (postId: string) => (userId ? togglePostUpvoteApi(postId, userId) : Promise.resolve(false)),
      [userId]
    ),
    toggleCommentUpvote: useCallback(
      (commentId: string) =>
        userId ? toggleCommentUpvoteApi(commentId, userId) : Promise.resolve(false),
      [userId]
    ),
  };
}
