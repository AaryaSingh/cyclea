import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { theme } from '../../constants/theme';

// Mock data for demonstration
const mockHashtags = [
  { name: '#GutCrew', count: 1250, color: theme.colors.primary },
  { name: '#CycleSync', count: 890, color: theme.colors.secondary },
  { name: '#MoodBoost', count: 650, color: theme.colors.accent3 },
  { name: '#WellnessJourney', count: 420, color: theme.colors.success },
  { name: '#HealthTips', count: 320, color: theme.colors.info },
  { name: '#SelfCare', count: 280, color: theme.colors.warning },
];

const mockPosts = [
  {
    id: '1',
    username: 'WellnessWarrior',
    content: 'Just discovered that my bloating is always worse 2 days before my period. Anyone else experience this? #GutCrew #CycleSync',
    hashtags: ['#GutCrew', '#CycleSync'],
    likes: 24,
    comments: 8,
    timeAgo: '2h ago',
    isAnonymous: false,
  },
  {
    id: '2',
    username: 'Anonymous',
    content: 'Feeling grateful for this app helping me understand my body better. The insights are so helpful! 💕',
    hashtags: ['#WellnessJourney'],
    likes: 18,
    comments: 5,
    timeAgo: '4h ago',
    isAnonymous: true,
  },
  {
    id: '3',
    username: 'HealthExplorer',
    content: 'Pro tip: Drinking peppermint tea really helps with my gut issues. What natural remedies work for you? #HealthTips #GutCrew',
    hashtags: ['#HealthTips', '#GutCrew'],
    likes: 31,
    comments: 12,
    timeAgo: '6h ago',
    isAnonymous: false,
  },
  {
    id: '4',
    username: 'Anonymous',
    content: 'Having a rough day with my cycle symptoms. Sending love to anyone else going through it today 💜 #CycleSync #SelfCare',
    hashtags: ['#CycleSync', '#SelfCare'],
    likes: 45,
    comments: 15,
    timeAgo: '8h ago',
    isAnonymous: true,
  },
];

const CommunityScreen: React.FC = () => {
  const [selectedHashtag, setSelectedHashtag] = useState<string | null>(null);
  const [newPost, setNewPost] = useState('');
  const [showNewPost, setShowNewPost] = useState(false);

  const handleLike = (postId: string) => {
    // TODO: Implement like functionality
    console.log('Liked post:', postId);
  };

  const handleComment = (postId: string) => {
    // TODO: Implement comment functionality
    console.log('Comment on post:', postId);
  };

  const handlePost = () => {
    if (newPost.trim()) {
      // TODO: Implement post creation
      console.log('New post:', newPost);
      setNewPost('');
      setShowNewPost(false);
    }
  };

  const renderPost = ({ item }: { item: typeof mockPosts[0] }) => (
    <View style={styles.postCard}>
      <View style={styles.postHeader}>
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Icon 
              name={item.isAnonymous ? 'person' : 'account-circle'} 
              size={24} 
              color={theme.colors.primary} 
            />
          </View>
          <View>
            <Text style={styles.username}>{item.username}</Text>
            <Text style={styles.timeAgo}>{item.timeAgo}</Text>
          </View>
        </View>
        {item.isAnonymous && (
          <Icon name="visibility-off" size={16} color={theme.colors.textLight} />
        )}
      </View>

      <Text style={styles.postContent}>{item.content}</Text>

      <View style={styles.postActions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handleLike(item.id)}
        >
          <Icon name="favorite-border" size={20} color={theme.colors.primary} />
          <Text style={styles.actionText}>{item.likes}</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handleComment(item.id)}
        >
          <Icon name="chat-bubble-outline" size={20} color={theme.colors.primary} />
          <Text style={styles.actionText}>{item.comments}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Icon name="share" size={20} color={theme.colors.primary} />
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const filteredPosts = selectedHashtag 
    ? mockPosts.filter(post => post.hashtags.includes(selectedHashtag))
    : mockPosts;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* New Post Button */}
        <TouchableOpacity 
          style={styles.newPostButton}
          onPress={() => setShowNewPost(!showNewPost)}
        >
          <Icon name="add" size={20} color={theme.colors.white} />
          <Text style={styles.newPostButtonText}>
            {showNewPost ? 'Cancel' : 'Share Something'}
          </Text>
        </TouchableOpacity>

        {/* New Post Form */}
        {showNewPost && (
          <View style={styles.newPostCard}>
            <TextInput
              style={styles.newPostInput}
              placeholder="Share your thoughts, tips, or experiences..."
              placeholderTextColor={theme.colors.textLight}
              value={newPost}
              onChangeText={setNewPost}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
            <View style={styles.newPostActions}>
              <TouchableOpacity style={styles.anonymousToggle}>
                <Icon name="visibility-off" size={16} color={theme.colors.textSecondary} />
                <Text style={styles.anonymousText}>Post anonymously</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.postButton, !newPost.trim() && styles.postButtonDisabled]}
                onPress={handlePost}
                disabled={!newPost.trim()}
              >
                <Text style={styles.postButtonText}>Post</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Hashtag Categories */}
        <View style={styles.hashtagSection}>
          <Text style={styles.sectionTitle}>Popular Topics</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.hashtagContainer}>
              <TouchableOpacity
                style={[
                  styles.hashtagChip,
                  !selectedHashtag && styles.hashtagChipSelected,
                ]}
                onPress={() => setSelectedHashtag(null)}
              >
                <Text style={[
                  styles.hashtagText,
                  !selectedHashtag && styles.hashtagTextSelected,
                ]}>
                  All Posts
                </Text>
              </TouchableOpacity>
              {mockHashtags.map((hashtag) => (
                <TouchableOpacity
                  key={hashtag.name}
                  style={[
                    styles.hashtagChip,
                    selectedHashtag === hashtag.name && styles.hashtagChipSelected,
                  ]}
                  onPress={() => setSelectedHashtag(hashtag.name)}
                >
                  <Text style={[
                    styles.hashtagText,
                    selectedHashtag === hashtag.name && styles.hashtagTextSelected,
                  ]}>
                    {hashtag.name}
                  </Text>
                  <Text style={[
                    styles.hashtagCount,
                    selectedHashtag === hashtag.name && styles.hashtagCountSelected,
                  ]}>
                    {hashtag.count}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Community Guidelines */}
        <View style={styles.guidelinesCard}>
          <Icon name="info" size={20} color={theme.colors.info} />
          <Text style={styles.guidelinesTitle}>Community Guidelines</Text>
          <Text style={styles.guidelinesText}>
            Be kind, supportive, and respectful. This is a safe space for sharing health experiences.
          </Text>
        </View>

        {/* Posts List */}
        <View style={styles.postsSection}>
          <Text style={styles.sectionTitle}>
            {selectedHashtag ? `Posts in ${selectedHashtag}` : 'Recent Posts'}
          </Text>
          <FlatList
            data={filteredPosts}
            renderItem={renderPost}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    padding: theme.spacing.lg,
  },
  newPostButton: {
    backgroundColor: theme.colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.medium,
  },
  newPostButtonText: {
    color: theme.colors.white,
    fontSize: theme.fontSizes.md,
    fontWeight: 'bold',
    marginLeft: theme.spacing.sm,
  },
  newPostCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.small,
  },
  newPostInput: {
    borderWidth: 1,
    borderColor: theme.colors.grayDark,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: theme.fontSizes.md,
    color: theme.colors.text,
    backgroundColor: theme.colors.background,
    minHeight: 100,
    marginBottom: theme.spacing.md,
  },
  newPostActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  anonymousToggle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  anonymousText: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.xs,
  },
  postButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
  },
  postButtonDisabled: {
    backgroundColor: theme.colors.grayDark,
  },
  postButtonText: {
    color: theme.colors.white,
    fontSize: theme.fontSizes.sm,
    fontWeight: 'bold',
  },
  hashtagSection: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.fontSizes.lg,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: theme.spacing.md,
  },
  hashtagContainer: {
    flexDirection: 'row',
    paddingRight: theme.spacing.lg,
  },
  hashtagChip: {
    backgroundColor: theme.colors.white,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.round,
    marginRight: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.grayDark,
    flexDirection: 'row',
    alignItems: 'center',
  },
  hashtagChipSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  hashtagText: {
    fontSize: theme.fontSizes.sm,
    fontWeight: '600',
    color: theme.colors.text,
  },
  hashtagTextSelected: {
    color: theme.colors.white,
  },
  hashtagCount: {
    fontSize: theme.fontSizes.xs,
    color: theme.colors.textLight,
    marginLeft: theme.spacing.xs,
  },
  hashtagCountSelected: {
    color: theme.colors.white,
  },
  guidelinesCard: {
    backgroundColor: theme.colors.accent,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  guidelinesTitle: {
    fontSize: theme.fontSizes.md,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginLeft: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  guidelinesText: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.sm,
    flex: 1,
    lineHeight: 18,
  },
  postsSection: {
    marginBottom: theme.spacing.lg,
  },
  postCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    ...theme.shadows.small,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },
  username: {
    fontSize: theme.fontSizes.md,
    fontWeight: '600',
    color: theme.colors.text,
  },
  timeAgo: {
    fontSize: theme.fontSizes.xs,
    color: theme.colors.textLight,
  },
  postContent: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.text,
    lineHeight: 22,
    marginBottom: theme.spacing.md,
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.gray,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
  },
  actionText: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.xs,
  },
});

export default CommunityScreen;
