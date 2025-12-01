import React, { useState, useEffect } from 'react';
import { Post, UserProfile, DailyTotals, SocialUser } from '../types';
import { getMockFeed, createPost, addComment, deletePost, toggleLike } from '../services/socialService';
import PostCard from './PostCard';
import CreatePostModal from './CreatePostModal';
import ConfirmationModal from './ConfirmationModal';
import { PlusIcon } from './icons/PlusIcon';

interface CommunityFeedProps {
    userProfile: UserProfile;
    dailyTotals: DailyTotals;
}

const CommunityFeed: React.FC<CommunityFeedProps> = ({ userProfile, dailyTotals }) => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [isCreatePostModalOpen, setCreatePostModalOpen] = useState(false);
    const [postToDelete, setPostToDelete] = useState<string | null>(null);

    useEffect(() => {
        setPosts(getMockFeed());
    }, []);

    const currentUser: SocialUser = {
        id: 'currentUser',
        name: userProfile.name,
        avatarUrl: userProfile.avatarUrl,
    };

    const handleCreatePost = (message: string) => {
        const newPost = createPost(
            currentUser,
            message,
            dailyTotals
        );
        setPosts(prevPosts => [newPost, ...prevPosts]);
        setCreatePostModalOpen(false);
    };

    const handleToggleLike = (postId: string) => {
        const updatedPost = toggleLike(postId, currentUser.id);
        if (updatedPost) {
            setPosts(posts.map(p => p.id === postId ? updatedPost : p));
        }
    };

    const handleAddComment = (postId: string, text: string) => {
        const updatedPost = addComment(postId, currentUser, text);
        if (updatedPost) {
            setPosts(posts.map(p => p.id === postId ? updatedPost : p));
        }
    };

    const handleDeleteRequest = (postId: string) => {
        setPostToDelete(postId);
    };

    const handleConfirmDelete = () => {
        if (postToDelete) {
            deletePost(postToDelete);
            setPosts(prevPosts => prevPosts.filter(p => p.id !== postToDelete));
            setPostToDelete(null);
        }
    };


    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-slate-800 dark:text-off-white">Community Feed</h2>
                <button 
                    onClick={() => setCreatePostModalOpen(true)}
                    className="flex items-center gap-2 bg-dark-cyan text-white font-semibold py-2 px-4 rounded-lg hover:bg-light-cyan transition-colors"
                >
                    <PlusIcon className="w-5 h-5" />
                    Post Update
                </button>
            </div>

            {posts.map(post => (
                <PostCard 
                    key={post.id} 
                    post={post} 
                    currentUser={currentUser}
                    onToggleLike={handleToggleLike}
                    onAddComment={handleAddComment}
                    onDeleteRequest={handleDeleteRequest}
                />
            ))}

            <CreatePostModal
                isOpen={isCreatePostModalOpen}
                onClose={() => setCreatePostModalOpen(false)}
                onSubmit={handleCreatePost}
                dailyTotals={dailyTotals}
            />

            <ConfirmationModal
                isOpen={!!postToDelete}
                onClose={() => setPostToDelete(null)}
                onConfirm={handleConfirmDelete}
                title="Delete Post"
            >
                Are you sure you want to permanently delete this post? This action cannot be undone.
            </ConfirmationModal>
        </div>
    );
};

export default CommunityFeed;