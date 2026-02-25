import { useState, useEffect } from 'react';
import { 
  MessageCircle, Heart, Users, Lock, Search, TrendingUp, ChevronLeft, Shield, 
  ThumbsUp, Pin, Award, Eye, Share2, Bookmark, MessageSquare, ArrowUp, Send
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Textarea } from './ui/textarea';
import { isSupabaseConfigured } from '../lib/supabase';
import { useCommunityTopics, useTopicPosts, usePostComments, useCommunityActions } from '../hooks/useCommunity';
import { toast } from 'sonner';

interface CommunityScreenProps {
  onBack: () => void;
  userId?: string | null;
}

interface CommunityTopic {
  id: string;
  title: string;
  members: number;
  posts: number;
  description: string;
  color: string;
  icon: string;
  online?: number;
}

interface Post {
  id: number;
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
}

interface Comment {
  id: number | string;
  author: string;
  authorBadge?: string;
  content: string;
  upvotes: number;
  time: string;
  hasUpvoted?: boolean;
  replies?: Comment[];
}

const COMMUNITY_TOPICS: CommunityTopic[] = [
  {
    id: 'pcos',
    title: 'PCOS Support',
    members: 12400,
    posts: 890,
    online: 234,
    description: 'Share experiences and management strategies for PCOS',
    color: '#F487B6',
    icon: '🎀',
  },
  {
    id: 'endo',
    title: 'Endometriosis Warriors',
    members: 8900,
    posts: 1240,
    online: 156,
    description: 'Connect with others managing endometriosis',
    color: '#9E6B8E',
    icon: '💜',
  },
  {
    id: 'ibs',
    title: 'IBS & Gut Health',
    members: 15200,
    posts: 2100,
    online: 389,
    description: 'Discuss digestive health and cycle-related GI symptoms',
    color: '#4FB0AE',
    icon: '🌿',
  },
  {
    id: 'ttc',
    title: 'Trying to Conceive',
    members: 10500,
    posts: 3400,
    online: 278,
    description: 'Support for fertility journey and cycle tracking',
    color: '#C59FA8',
    icon: '🤰',
  },
  {
    id: 'perimenopause',
    title: 'Perimenopause & Menopause',
    members: 6700,
    posts: 780,
    online: 123,
    description: 'Navigate hormonal transitions together',
    color: '#FFC0D3',
    icon: '🌸',
  },
  {
    id: 'mental-health',
    title: 'Mental Health & Hormones',
    members: 9200,
    posts: 1560,
    online: 198,
    description: 'Discuss PMDD, anxiety, and mood changes',
    color: '#69C9C0',
    icon: '🧠',
  },
];

const COMMUNITY_POSTS: Record<string, Post[]> = {
  'pcos': [
    {
      id: 1,
      communityId: 'pcos',
      author: 'SarahM_89',
      authorBadge: 'Verified Member',
      title: 'Finally found what helps my bloating during luteal phase [SUCCESS]',
      content: 'After tracking for 3 months with Cyclea, I noticed my bloating always peaked days 20-25 of my cycle. My doctor suggested trying magnesium glycinate (400mg) starting day 14. Game changer! My bloating is down 70%. Anyone else try this?',
      upvotes: 847,
      comments: 156,
      views: 4200,
      time: '2h ago',
      flair: 'Success Story',
      hasUpvoted: false,
    },
    {
      id: 2,
      communityId: 'pcos',
      author: 'InsulinResistantWarrior',
      title: 'Metformin side effects - when do they get better?',
      content: 'Started metformin 2 weeks ago (500mg 2x daily). The GI side effects are rough. For those who stuck with it, when did it get better? My doctor says to push through for 4-6 weeks.',
      upvotes: 234,
      comments: 89,
      views: 1890,
      time: '5h ago',
      flair: 'Question',
      hasUpvoted: false,
    },
    {
      id: 3,
      communityId: 'pcos',
      author: 'Dr_Chen_Endo',
      authorBadge: 'Medical Professional',
      title: 'PSA: Not all PCOS is the same - understanding PCOS phenotypes',
      content: 'As an endocrinologist, I see many patients frustrated because treatments that worked for others don\'t work for them. PCOS has 4 phenotypes based on Rotterdam criteria. Understanding YOUR type is crucial for treatment...',
      upvotes: 1520,
      comments: 203,
      views: 8900,
      time: '1d ago',
      isPinned: true,
      flair: 'Medical Info',
      hasUpvoted: false,
    },
    {
      id: 4,
      communityId: 'pcos',
      author: 'FitnessPCOSGirl',
      title: 'Strength training changed my insulin sensitivity more than cardio',
      content: 'I was doing an hour of cardio 5x/week with minimal results. Switched to 3x/week strength training and my fasting insulin dropped 40% in 3 months. Sharing my routine...',
      upvotes: 678,
      comments: 112,
      views: 3200,
      time: '2d ago',
      flair: 'Fitness',
      hasUpvoted: false,
    },
  ],
  'endo': [
    {
      id: 5,
      communityId: 'endo',
      author: 'EmmaK_RN',
      authorBadge: 'Medical Professional',
      title: 'My OBGYN used my Cyclea data to diagnose endo without laparoscopy',
      content: 'The pain correlation chart showed clear cycle patterns (worst during menstruation AND ovulation, plus deep dyspareunia). Combined with transvaginal ultrasound showing endometriomas, my doc started treatment without surgery. 6 months on continuous BC and pain is down from 9/10 to 3/10.',
      upvotes: 1240,
      comments: 203,
      views: 8900,
      time: '5h ago',
      isPinned: true,
      flair: 'Success Story',
      hasUpvoted: false,
    },
    {
      id: 6,
      communityId: 'endo',
      author: 'ChronicPainWarrior',
      title: 'Excision surgery vs ablation - what I wish I knew before',
      content: 'Had ablation 2 years ago, pain came back in 8 months. Just had excision with a specialist. Recovery is harder but I feel hopeful this time. Here\'s what I learned...',
      upvotes: 892,
      comments: 145,
      views: 4500,
      time: '1d ago',
      flair: 'Experience',
      hasUpvoted: false,
    },
  ],
  'ibs': [
    {
      id: 7,
      communityId: 'ibs',
      author: 'LisaP_IBS',
      title: 'Low FODMAP during luteal phase = game changer [DIET]',
      content: 'My GI doc recommended tracking symptoms with my cycle. Turns out my IBS-C gets 10x worse during luteal phase (progesterone slowing everything down). I now do strict low FODMAP days 14-28, and regular diet during follicular. Bloating and pain are SO much better.',
      upvotes: 523,
      comments: 89,
      views: 2100,
      time: '1d ago',
      flair: 'Diet Tips',
      hasUpvoted: false,
    },
    {
      id: 8,
      communityId: 'ibs',
      author: 'GutHealthNerd',
      title: 'Period diarrhea is NOT just IBS - it\'s prostaglandins',
      content: 'Just learned from my GI doc: prostaglandins that cause cramps ALSO affect your intestines. That\'s why so many of us get diarrhea during periods. Taking ibuprofen blocks prostaglandins and helps both cramps AND digestive issues.',
      upvotes: 1089,
      comments: 167,
      views: 5600,
      time: '3h ago',
      flair: 'Educational',
      hasUpvoted: false,
    },
  ],
};

const POST_COMMENTS: Record<number, Comment[]> = {
  1: [
    {
      id: 1,
      author: 'PCOSQueen',
      authorBadge: 'Moderator',
      content: 'This is great! Magnesium glycinate is the best form for absorption. I also take it with dinner to avoid GI upset. Make sure you\'re getting enough vitamin D too - it helps with PCOS symptoms!',
      upvotes: 234,
      time: '1h ago',
      hasUpvoted: false,
      replies: [
        {
          id: 2,
          author: 'SarahM_89',
          content: 'Good tip! My doc did find I was vitamin D deficient. I\'m taking 5000 IU daily now.',
          upvotes: 89,
          time: '45m ago',
          hasUpvoted: false,
        },
        {
          id: 3,
          author: 'VitaminDGirl',
          content: 'Same here! My PCOS symptoms improved so much once I got my vitamin D levels up.',
          upvotes: 56,
          time: '30m ago',
          hasUpvoted: false,
        },
      ],
    },
    {
      id: 4,
      author: 'InositolGirl',
      content: 'Have you tried inositol? It helped my insulin resistance AND bloating. I do 2g myo-inositol + 50mg D-chiro-inositol (40:1 ratio) daily. Studies show it works as well as metformin for some people!',
      upvotes: 156,
      time: '1h ago',
      hasUpvoted: false,
    },
    {
      id: 5,
      author: 'NaturalPath_RD',
      authorBadge: 'Registered Dietitian',
      content: 'Great success story! Just a reminder: if you\'re taking any medications, check with your pharmacist about magnesium interactions (especially thyroid meds, antibiotics, or bisphosphonates). Take it 2-4 hours apart from other supplements.',
      upvotes: 412,
      time: '30m ago',
      hasUpvoted: false,
    },
    {
      id: 6,
      author: 'CyclingSarah',
      content: 'Does anyone else notice their PCOS symptoms get worse during luteal phase? My acne and cravings go crazy days 20-28.',
      upvotes: 78,
      time: '20m ago',
      hasUpvoted: false,
      replies: [
        {
          id: 7,
          author: 'Dr_Chen_Endo',
          authorBadge: 'Medical Professional',
          content: 'This is very common! Progesterone in the luteal phase can worsen insulin resistance temporarily. This is why tracking with your cycle is so valuable - it helps identify these patterns.',
          upvotes: 234,
          time: '10m ago',
          hasUpvoted: false,
        },
      ],
    },
  ],
  8: [
    {
      id: 8,
      author: 'GI_Specialist_MD',
      authorBadge: 'Medical Professional',
      content: 'Gastroenterologist here - this is 100% accurate. Prostaglandins (PGE2 and PGF2α) cause uterine contractions AND increase intestinal motility. NSAIDs like ibuprofen inhibit prostaglandin synthesis, which is why they help both cramps and diarrhea. Take with food to avoid GI irritation.',
      upvotes: 892,
      time: '2h ago',
      hasUpvoted: false,
    },
    {
      id: 9,
      author: 'IBS_Warrior_2024',
      content: 'THANK YOU for posting this! I\'ve been dealing with this for years and no one ever explained the connection. My GI doc just said "it\'s normal" but never explained WHY.',
      upvotes: 345,
      time: '1h ago',
      hasUpvoted: false,
    },
    {
      id: 10,
      author: 'NaturalRemediesGirl',
      content: 'For those who can\'t take NSAIDs, ginger tea and magnesium can help reduce prostaglandins naturally. I also avoid dairy and caffeine during my period.',
      upvotes: 167,
      time: '45m ago',
      hasUpvoted: false,
      replies: [
        {
          id: 11,
          author: 'HolisticHealthRN',
          authorBadge: 'Medical Professional',
          content: 'Adding to this: omega-3 fatty acids (from fish oil or flaxseed) also help reduce inflammatory prostaglandins. Aim for 1-2g EPA+DHA daily.',
          upvotes: 112,
          time: '20m ago',
          hasUpvoted: false,
        },
      ],
    },
  ],
};

const RECENT_POSTS = [
  {
    id: 1,
    topic: 'PCOS Support',
    author: 'Sarah M.',
    title: 'Finally found what helps my bloating during luteal phase',
    preview: 'After tracking for 3 months, I noticed a clear pattern...',
    replies: 23,
    likes: 45,
    time: '2h ago',
    verified: true,
  },
  {
    id: 2,
    topic: 'Endometriosis Warriors',
    author: 'Emma K.',
    title: 'My OBGYN used my Cyclea data to diagnose endo',
    preview: 'The pain correlation chart showed clear cycle patterns...',
    replies: 67,
    likes: 128,
    time: '5h ago',
    verified: true,
  },
  {
    id: 3,
    topic: 'IBS & Gut Health',
    author: 'Lisa P.',
    title: 'Low FODMAP during luteal phase = game changer',
    preview: 'My GI doc recommended tracking my symptoms with my cycle...',
    replies: 34,
    likes: 89,
    time: '1d ago',
    verified: false,
  },
];

const FEATURED_DISCUSSIONS = [
  {
    title: 'How I used Cyclea to avoid 3 specialist referrals',
    author: 'Dr. Rodriguez (OBGYN)',
    description: 'A case study on correlating pelvic pain with cycle phases',
    verified: true,
    category: 'Clinical Insights',
  },
  {
    title: 'Understanding Your Cycle Phases: A Visual Guide',
    author: 'Health Educator Team',
    description: 'What happens in your body during each phase',
    verified: true,
    category: 'Education',
  },
];

export function CommunityScreen({ onBack, userId }: CommunityScreenProps) {
  const [activeTab, setActiveTab] = useState('topics');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCommunity, setSelectedCommunity] = useState<CommunityTopic | null>(null);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [sortBy, setSortBy] = useState<'hot' | 'new' | 'top'>('hot');
  const [commentText, setCommentText] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [mockPosts, setMockPosts] = useState<Post[]>([]);
  const [mockComments, setMockComments] = useState<Comment[]>([]);

  const { topics: supabaseTopics, loading: topicsLoading } = useCommunityTopics();
  const { posts: supabasePosts, loading: postsLoading } = useTopicPosts(
    selectedCommunity?.id ?? null,
    userId ?? null
  );
  const { comments: supabaseComments, setComments: setSupabaseComments, loading: commentsLoading } =
    usePostComments(selectedPost?.id ? String(selectedPost.id) : null, userId ?? null);
  const actions = useCommunityActions(userId ?? null);

  const topics = isSupabaseConfigured() ? supabaseTopics : COMMUNITY_TOPICS;
  const posts = isSupabaseConfigured()
    ? (supabasePosts as Post[])
    : mockPosts;
  const comments = isSupabaseConfigured()
    ? (supabaseComments as Comment[])
    : mockComments;

  const handleCommunityClick = (community: CommunityTopic) => {
    setSelectedCommunity(community);
    setSelectedPost(null);
  };

  const handleBackToCommunities = () => {
    setSelectedCommunity(null);
    setMockPosts([]);
    setSelectedPost(null);
    setMockComments([]);
  };

  const handlePostClick = (post: Post) => {
    setSelectedPost(post);
    if (!isSupabaseConfigured()) {
      setMockComments(POST_COMMENTS[Number(post.id)] || []);
    }
  };

  const handleBackToFeed = () => {
    setSelectedPost(null);
    setMockComments([]);
  };

  const handleUpvote = async (postId: number | string) => {
    if (isSupabaseConfigured() && userId) {
      await actions.togglePostUpvote(String(postId));
      return;
    }
    setMockPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            upvotes: post.hasUpvoted ? post.upvotes - 1 : post.upvotes + 1,
            hasUpvoted: !post.hasUpvoted,
          };
        }
        return post;
      })
    );
  };

  const handleCommentUpvote = async (commentId: number | string) => {
    if (isSupabaseConfigured() && userId) {
      await actions.toggleCommentUpvote(String(commentId));
      return;
    }
    const updateReplies = (list: Comment[]): Comment[] =>
      list.map((c) => {
        if (c.id === commentId) {
          return {
            ...c,
            upvotes: c.hasUpvoted ? c.upvotes - 1 : c.upvotes + 1,
            hasUpvoted: !c.hasUpvoted,
          };
        }
        if (c.replies?.length) return { ...c, replies: updateReplies(c.replies) };
        return c;
      });
    setMockComments((prev) => updateReplies(prev));
  };

  // Post Detail View with Comments
  if (selectedPost && selectedCommunity) {
    return (
      <div className="min-h-screen bg-[#FFF0F5] pb-20">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#F487B6] to-[#FFC0D3] text-white p-4">
          <div className="max-w-4xl mx-auto">
            <Button
              onClick={handleBackToFeed}
              variant="ghost"
              className="text-white hover:bg-white/10 mb-2"
              size="sm"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back to {selectedCommunity.title}
            </Button>
          </div>
        </div>

        <div className="max-w-4xl mx-auto p-4 space-y-4">
          {/* Post Card */}
          <Card>
            <CardContent className="p-0">
              <div className="flex">
                {/* Upvote Section */}
                <div className="w-16 bg-gray-50 flex flex-col items-center py-4 rounded-l-lg">
                  <button
                    onClick={() => handleUpvote(selectedPost.id)}
                    className={`p-1 rounded transition-colors ${
                      selectedPost.hasUpvoted
                        ? 'text-[#F487B6] bg-[#F487B6]/10'
                        : 'text-gray-400 hover:text-[#F487B6] hover:bg-[#F487B6]/10'
                    }`}
                  >
                    <ArrowUp className="w-6 h-6" />
                  </button>
                  <span className={`text-sm font-bold my-1 ${
                    selectedPost.hasUpvoted ? 'text-[#F487B6]' : 'text-gray-700'
                  }`}>
                    {selectedPost.upvotes}
                  </span>
                </div>

                {/* Post Content */}
                <div className="flex-1 p-4">
                  <div className="flex items-center gap-2 mb-2 text-xs text-gray-500">
                    {selectedPost.flair && (
                      <Badge
                        variant="outline"
                        className="text-xs"
                        style={{ borderColor: selectedCommunity.color, color: selectedCommunity.color }}
                      >
                        {selectedPost.flair}
                      </Badge>
                    )}
                    <span>Posted by</span>
                    <span className="font-medium text-gray-700">{selectedPost.author}</span>
                    {selectedPost.authorBadge && (
                      <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-300">
                        ✓ {selectedPost.authorBadge}
                      </Badge>
                    )}
                    <span>•</span>
                    <span>{selectedPost.time}</span>
                  </div>

                  <h1 className="text-xl font-bold text-gray-900 mb-3">{selectedPost.title}</h1>
                  <p className="text-gray-700 mb-4 leading-relaxed">{selectedPost.content}</p>

                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" />
                      <span>{comments.length} Comments</span>
                    </div>
                    <button className="flex items-center gap-1 hover:bg-gray-100 px-2 py-1 rounded">
                      <Share2 className="w-4 h-4" />
                      <span>Share</span>
                    </button>
                    <button className="flex items-center gap-1 hover:bg-gray-100 px-2 py-1 rounded">
                      <Bookmark className="w-4 h-4" />
                      <span>Save</span>
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Comment Input */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#F487B6] to-[#FFC0D3] flex items-center justify-center text-white text-xs font-bold">
                  U
                </div>
                <div className="flex-1">
                  <Textarea
                    placeholder="What are your thoughts?"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="mb-2 min-h-[80px]"
                  />
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => setCommentText('')}>
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      className="bg-[#F487B6] hover:bg-[#F487B6]/90"
                      disabled={!commentText.trim() || isSubmittingComment}
                      onClick={async () => {
                        const text = commentText.trim();
                        if (!text) return;
                        if (isSupabaseConfigured() && userId && selectedPost) {
                          setIsSubmittingComment(true);
                          const id = await actions.createComment(String(selectedPost.id), text);
                          setIsSubmittingComment(false);
                          if (id) {
                            setCommentText('');
                            toast.success('Comment posted!');
                          } else {
                            toast.error('Failed to post comment');
                          }
                        } else {
                          const newComment: Comment = {
                            id: Date.now(),
                            author: 'You',
                            content: text,
                            upvotes: 0,
                            time: 'just now',
                            hasUpvoted: false,
                          };
                          setMockComments((prev) => [...prev, newComment]);
                          setCommentText('');
                          toast.success('Comment added (demo mode)');
                        }
                      }}
                    >
                      <Send className="w-4 h-4 mr-1" />
                      Comment
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Comments */}
          <div className="space-y-3">
            {comments.map((comment) => (
              <Card key={comment.id}>
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    {/* Upvote Column */}
                    <div className="flex flex-col items-center gap-1 w-8">
                      <button
                        onClick={() => handleCommentUpvote(comment.id)}
                        className={`p-0.5 rounded transition-colors ${
                          comment.hasUpvoted
                            ? 'text-[#F487B6]'
                            : 'text-gray-400 hover:text-[#F487B6]'
                        }`}
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <span className={`text-xs font-bold ${
                        comment.hasUpvoted ? 'text-[#F487B6]' : 'text-gray-600'
                      }`}>
                        {comment.upvotes}
                      </span>
                    </div>

                    {/* Comment Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                        <span className="font-medium text-gray-700">{comment.author}</span>
                        {comment.authorBadge && (
                          <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-300">
                            ✓ {comment.authorBadge}
                          </Badge>
                        )}
                        <span>•</span>
                        <span>{comment.time}</span>
                      </div>
                      <p className="text-sm text-gray-700 mb-2 leading-relaxed">{comment.content}</p>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <button className="hover:text-[#F487B6] font-medium">Reply</button>
                        <button className="hover:text-[#F487B6]">Share</button>
                      </div>

                      {/* Replies */}
                      {comment.replies && comment.replies.length > 0 && (
                        <div className="mt-3 pl-4 border-l-2 border-gray-200 space-y-3">
                          {comment.replies.map((reply) => (
                            <div key={reply.id} className="flex gap-2">
                              <div className="flex flex-col items-center gap-1 w-6">
                                <button
                                  onClick={() => handleCommentUpvote(reply.id)}
                                  className={`p-0.5 rounded transition-colors ${
                                    reply.hasUpvoted
                                      ? 'text-[#F487B6]'
                                      : 'text-gray-400 hover:text-[#F487B6]'
                                  }`}
                                >
                                  <ArrowUp className="w-3 h-3" />
                                </button>
                                <span className={`text-xs font-bold ${
                                  reply.hasUpvoted ? 'text-[#F487B6]' : 'text-gray-600'
                                }`}>
                                  {reply.upvotes}
                                </span>
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                                  <span className="font-medium text-gray-700">{reply.author}</span>
                                  {reply.authorBadge && (
                                    <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-300">
                                      ✓ {reply.authorBadge}
                                    </Badge>
                                  )}
                                  <span>•</span>
                                  <span>{reply.time}</span>
                                </div>
                                <p className="text-sm text-gray-700">{reply.content}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Community Detail View
  if (selectedCommunity) {
    return (
      <div className="min-h-screen bg-[#FFF0F5] pb-20">
        {/* Community Header */}
        <div className="bg-gradient-to-r from-[#F487B6] to-[#FFC0D3] text-white p-6">
          <div className="max-w-6xl mx-auto">
            <Button
              onClick={handleBackToCommunities}
              variant="ghost"
              className="text-white hover:bg-white/10 mb-4"
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              Back to Communities
            </Button>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
                  style={{ backgroundColor: 'white' }}
                >
                  {selectedCommunity.icon}
                </div>
                <div>
                  <h1 className="text-white mb-1 text-2xl font-bold">{selectedCommunity.title}</h1>
                  <p className="text-white/80 mb-2">{selectedCommunity.description}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {selectedCommunity.members.toLocaleString()} members
                    </span>
                    <span>•</span>
                    <span className="text-green-300">
                      {selectedCommunity.online?.toLocaleString()} online
                    </span>
                  </div>
                </div>
              </div>
              <Button className="bg-white text-[#F487B6] hover:bg-white/90">
                Join Community
              </Button>
            </div>
          </div>
        </div>

        {/* Community Content */}
        <div className="max-w-6xl mx-auto p-6">
          <div className="flex gap-6">
            {/* Main Feed */}
            <div className="flex-1 space-y-4">
              {/* Sort & Create Post */}
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  {['hot', 'new', 'top'].map((sort) => (
                    <button
                      key={sort}
                      onClick={() => setSortBy(sort as any)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                        sortBy === sort
                          ? 'bg-[#F487B6] text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {sort === 'hot' && '🔥 '}
                      {sort === 'new' && '🆕 '}
                      {sort === 'top' && '⭐ '}
                      {sort}
                    </button>
                  ))}
                </div>
                <Button className="bg-[#F487B6] hover:bg-[#F487B6]/90">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  New Post
                </Button>
              </div>

              {/* Posts */}
              <div className="space-y-3">
                {posts.map((post) => (
                  <Card key={post.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-0">
                      <div className="flex">
                        {/* Upvote Section */}
                        <div className="w-16 bg-gray-50 flex flex-col items-center py-4 rounded-l-lg">
                          <button
                            onClick={() => handleUpvote(post.id)}
                            className={`p-1 rounded transition-colors ${
                              post.hasUpvoted
                                ? 'text-[#F487B6] bg-[#F487B6]/10'
                                : 'text-gray-400 hover:text-[#F487B6] hover:bg-[#F487B6]/10'
                            }`}
                          >
                            <ArrowUp className="w-6 h-6" />
                          </button>
                          <span className={`text-sm font-bold my-1 ${
                            post.hasUpvoted ? 'text-[#F487B6]' : 'text-gray-700'
                          }`}>
                            {post.upvotes}
                          </span>
                        </div>

                        {/* Post Content */}
                        <div className="flex-1 p-4">
                          {/* Post Header */}
                          <div className="flex items-center gap-2 mb-2 text-xs text-gray-500">
                            {post.isPinned && (
                              <Pin className="w-4 h-4 text-green-600" />
                            )}
                            {post.flair && (
                              <Badge
                                variant="outline"
                                className="text-xs"
                                style={{ borderColor: selectedCommunity.color, color: selectedCommunity.color }}
                              >
                                {post.flair}
                              </Badge>
                            )}
                            <span>Posted by</span>
                            <span className="font-medium text-gray-700">{post.author}</span>
                            {post.authorBadge && (
                              <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-300">
                                ✓ {post.authorBadge}
                              </Badge>
                            )}
                            <span>•</span>
                            <span>{post.time}</span>
                          </div>

                          {/* Post Title & Content */}
                          <h3 className="font-bold text-gray-900 mb-2 text-lg hover:text-[#F487B6] cursor-pointer transition-colors" onClick={() => handlePostClick(post)}>
                            {post.title}
                          </h3>
                          <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                            {post.content}
                          </p>

                          {/* Post Actions */}
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <button className="flex items-center gap-1 hover:bg-gray-100 px-2 py-1 rounded transition-colors">
                              <MessageCircle className="w-4 h-4" />
                              <span>{post.comments} Comments</span>
                            </button>
                            <button className="flex items-center gap-1 hover:bg-gray-100 px-2 py-1 rounded transition-colors">
                              <Share2 className="w-4 h-4" />
                              <span>Share</span>
                            </button>
                            <button className="flex items-center gap-1 hover:bg-gray-100 px-2 py-1 rounded transition-colors">
                              <Bookmark className="w-4 h-4" />
                              <span>Save</span>
                            </button>
                            <div className="flex items-center gap-1 ml-auto">
                              <Eye className="w-4 h-4" />
                              <span>{post.views.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="w-80 space-y-4 hidden lg:block">
              {/* About Community */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">About Community</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700 mb-4">{selectedCommunity.description}</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Members</span>
                      <span className="font-bold">{selectedCommunity.members.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Online</span>
                      <span className="font-bold text-green-600">{selectedCommunity.online?.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Posts</span>
                      <span className="font-bold">{selectedCommunity.posts.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Community Rules */}
              <Card className="border-yellow-200 bg-yellow-50">
                <CardHeader>
                  <CardTitle className="text-sm text-yellow-900 flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Community Rules
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-2 text-sm text-yellow-900 list-decimal list-inside">
                    <li>Be respectful and supportive</li>
                    <li>Share experiences, not medical advice</li>
                    <li>Cite credible sources</li>
                    <li>No spam or self-promotion</li>
                    <li>Protect privacy - no identifying info</li>
                  </ol>
                </CardContent>
              </Card>

              {/* Moderators */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Moderators</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#F487B6] to-[#FFC0D3] flex items-center justify-center text-white text-xs font-bold">
                        DM
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Dr. Martinez</p>
                        <p className="text-xs text-gray-500">Medical Advisor</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#69C9C0] to-[#4FB0AE] flex items-center justify-center text-white text-xs font-bold">
                        SK
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Sarah K.</p>
                        <p className="text-xs text-gray-500">Community Mod</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Communities List View
  return (
    <div className="min-h-screen bg-[#FFF0F5] pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#F487B6] to-[#FFC0D3] text-white p-6">
        <div className="max-w-4xl mx-auto">
          <Button
            onClick={onBack}
            variant="ghost"
            className="text-white hover:bg-white/10 mb-4"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-white mb-2">Circles</h1>
              <p className="text-white/80">Connect, share, and learn together</p>
            </div>
            <Users className="w-12 h-12 text-white/80" />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Privacy Notice */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-blue-900">
                  <strong>Safe Space:</strong> All posts are anonymous by default. Your health data is never shared. Community guidelines are medically reviewed to ensure accurate, helpful information.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Search topics, symptoms, or diagnoses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="topics">Topics</TabsTrigger>
            <TabsTrigger value="recent">Recent</TabsTrigger>
            <TabsTrigger value="featured">Featured</TabsTrigger>
          </TabsList>

          {/* Topics */}
          <TabsContent value="topics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Discussion Topics</CardTitle>
                <CardDescription>
                  Join condition-specific communities for support and information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {COMMUNITY_TOPICS.map((topic) => (
                  <div
                    key={topic.id}
                    onClick={() => handleCommunityClick(topic)}
                    className="p-4 rounded-lg border-2 border-gray-200 hover:border-[#F487B6] transition-all cursor-pointer hover:shadow-md"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center text-xl"
                          style={{ backgroundColor: `${topic.color}20` }}
                        >
                          {topic.icon}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 text-lg">{topic.title}</h4>
                          <p className="text-sm text-gray-600">{topic.description}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500 ml-15">
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {topic.members.toLocaleString()} members
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="w-4 h-4" />
                        {topic.posts.toLocaleString()} posts
                      </span>
                      {topic.online && (
                        <>
                          <span>•</span>
                          <span className="text-green-600">{topic.online} online</span>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Clinical Insight Card */}
            <Card className="bg-purple-50 border-purple-200">
              <CardHeader>
                <CardTitle className="text-purple-900 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Community Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-purple-900 mb-3">
                  <strong>Did you know?</strong> 73% of community members who tracked for 3+ months reported better communication with their doctors and fewer unnecessary specialist referrals.
                </p>
                <p className="text-xs text-purple-700">
                  Data from anonymized community surveys, reviewed by medical advisory board.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Recent Posts */}
          <TabsContent value="recent" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Discussions</CardTitle>
                <CardDescription>
                  Latest posts from the community
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {RECENT_POSTS.map((post) => (
                  <div
                    key={post.id}
                    className="p-4 rounded-lg border border-gray-200 hover:border-[#F487B6] transition-colors cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant="outline" className="bg-[#F487B6]/10 text-[#F487B6]">
                        {post.topic}
                      </Badge>
                      {post.verified && (
                        <Badge className="bg-green-500">
                          Verified ✓
                        </Badge>
                      )}
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-1">{post.title}</h4>
                    <p className="text-sm text-gray-600 mb-3">{post.preview}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>by {post.author} • {post.time}</span>
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <MessageCircle className="w-4 h-4" />
                          {post.replies}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="w-4 h-4" />
                          {post.likes}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Moderation Note */}
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4">
                <p className="text-sm text-green-900">
                  <strong>✓ Medically Reviewed:</strong> All posts with the "Verified" badge have been reviewed by our medical advisory board for accuracy. Always consult your healthcare provider for personalized medical advice.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Featured */}
          <TabsContent value="featured" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Featured Content</CardTitle>
                <CardDescription>
                  Curated insights from healthcare professionals and educators
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {FEATURED_DISCUSSIONS.map((discussion, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-lg bg-gradient-to-r from-[#4FB0AE]/10 to-[#69C9C0]/10 border-2 border-[#4FB0AE]/30 cursor-pointer hover:border-[#4FB0AE] transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <Badge className="bg-[#4FB0AE]">{discussion.category}</Badge>
                      {discussion.verified && (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                          Medical Professional ✓
                        </Badge>
                      )}
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">{discussion.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">{discussion.description}</p>
                    <p className="text-xs text-gray-500">by {discussion.author}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Clinical Use Case */}
            <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-900">For Healthcare Providers</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-blue-900 mb-4">
                  OBGYNs can share de-identified case studies showing how patient-generated data led to accurate diagnoses and reduced referral fatigue. These real-world examples help patients understand the clinical value of consistent tracking.
                </p>
                <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100">
                  Submit Case Study
                </Button>
              </CardContent>
            </Card>

            {/* Community Guidelines */}
            <Card className="border-2 border-yellow-300 bg-yellow-50">
              <CardHeader>
                <CardTitle className="text-yellow-900 flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  Community Guidelines
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-yellow-900">
                  <li>✓ Share experiences, not medical advice</li>
                  <li>✓ Be respectful and supportive</li>
                  <li>✓ Keep posts relevant to women's health</li>
                  <li>✓ Report misinformation or harmful content</li>
                  <li>✗ No selling products or services</li>
                  <li>✗ No sharing identifying patient information</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}