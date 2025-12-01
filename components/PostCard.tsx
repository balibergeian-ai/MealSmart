import React, { useState, useEffect, useRef } from 'react';
import { Post, SocialUser } from '../types';
import { HeartIcon } from './icons/HeartIcon';
import { ChatBubbleIcon } from './icons/ChatBubbleIcon';
import { DotsVerticalIcon } from './icons/DotsVerticalIcon';
import Avatar from './Avatar';


interface PostCardProps {
    post: Post;
    currentUser: SocialUser;
    onToggleLike: (postId: string) => void;
    onAddComment: (postId: string, text: string) => void;
    onDeleteRequest: (postId: string) => void;
}

const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "y ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "mo ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m ago";
    return Math.floor(seconds) + "s ago";
};


const PostCard: React.FC<PostCardProps> = ({ post, currentUser, onToggleLike, onAddComment, onDeleteRequest }) => {
    const [commentsVisible, setCommentsVisible] = useState(false);
    const [newCommentText, setNewCommentText] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const isAuthor = currentUser.id === post.author.id;
    const isLiked = post.likes.includes(currentUser.id);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [menuRef]);

    const handleCommentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newCommentText.trim()) {
            onAddComment(post.id, newCommentText.trim());
            setNewCommentText('');
        }
    };

    const handleDeleteClick = () => {
        onDeleteRequest(post.id);
        setIsMenuOpen(false);
    }

    return (
        <div className="bg-white dark:bg-slate-800/50 p-5 rounded-xl shadow-md space-y-4">
            {/* Post Header */}
            <div className="flex items-start gap-3">
                <Avatar user={post.author} />
                <div className="flex-grow">
                    <p className="font-bold text-slate-800 dark:text-off-white">{post.author.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{timeAgo(post.timestamp)}</p>
                </div>
                {isAuthor && (
                    <div className="relative" ref={menuRef}>
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-off-white p-1 rounded-full">
                            <DotsVerticalIcon className="w-5 h-5" />
                        </button>
                        {isMenuOpen && (
                            <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-slate-700 rounded-md shadow-lg z-10 animate-fade-in origin-top-right ring-1 ring-black ring-opacity-5">
                                <button
                                    onClick={handleDeleteClick}
                                    className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-500/10 dark:hover:bg-red-500/20"
                                >
                                    Delete Post
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Post Content */}
            {post.message && <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{post.message}</p>}

            {/* Nutrition Summary */}
            <div className="bg-slate-100 dark:bg-slate-900/70 p-3 rounded-lg">
                 <p className="text-sm font-semibold text-slate-800 dark:text-off-white mb-2">Today's Summary</p>
                 <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                    <div><span className="font-bold text-dark-cyan">{Math.round(post.dailySummary.calories)}</span><p className="text-xs text-slate-500 dark:text-slate-400">kcal</p></div>
                    <div><span className="font-bold text-slate-800 dark:text-off-white">{Math.round(post.dailySummary.protein)}g</span><p className="text-xs text-slate-500 dark:text-slate-400">Protein</p></div>
                    <div><span className="font-bold text-slate-800 dark:text-off-white">{Math.round(post.dailySummary.carbs)}g</span><p className="text-xs text-slate-500 dark:text-slate-400">Carbs</p></div>
                    <div><span className="font-bold text-slate-800 dark:text-off-white">{Math.round(post.dailySummary.fat)}g</span><p className="text-xs text-slate-500 dark:text-slate-400">Fat</p></div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-6 pt-2 border-t border-slate-200 dark:border-slate-700/50">
                <button 
                    onClick={() => onToggleLike(post.id)}
                    className={`flex items-center gap-2 transition-colors ${isLiked ? 'text-red-500' : 'text-slate-500 dark:text-slate-400 hover:text-red-500'}`}
                >
                    <HeartIcon className="w-5 h-5" filled={isLiked} />
                    <span className="text-sm font-semibold">{post.likes.length}</span>
                </button>
                 <button onClick={() => setCommentsVisible(!commentsVisible)} className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-sky-500 transition-colors">
                    <ChatBubbleIcon className="w-5 h-5" />
                    <span className="text-sm font-semibold">{post.comments.length}</span>
                </button>
            </div>

            {/* Comment Section */}
            {commentsVisible && (
                <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-700/50 space-y-4 animate-fade-in">
                    <form onSubmit={handleCommentSubmit} className="flex items-center gap-2">
                        <Avatar user={currentUser} size="sm" />
                        <input
                            type="text"
                            value={newCommentText}
                            onChange={(e) => setNewCommentText(e.target.value)}
                            placeholder="Add a comment..."
                            className="w-full bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600 rounded-full py-2 px-4 focus:ring-dark-cyan focus:border-dark-cyan transition text-slate-800 dark:text-off-white placeholder-slate-400 dark:placeholder-slate-400"
                        />
                        <button type="submit" className="bg-dark-cyan text-white font-semibold py-2 px-4 rounded-full hover:bg-light-cyan transition-colors disabled:bg-slate-400 dark:disabled:bg-slate-600" disabled={!newCommentText.trim()}>
                            Post
                        </button>
                    </form>
                    <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                        {post.comments.map(comment => (
                            <div key={comment.id} className="flex items-start gap-3">
                                <Avatar user={comment.author} size="sm" />
                                <div>
                                    <div className="bg-slate-100 dark:bg-slate-700/80 rounded-lg px-3 py-2">
                                        <div className="flex items-center gap-2">
                                            <p className="font-bold text-sm text-slate-800 dark:text-off-white">{comment.author.name}</p>
                                            <p className="text-xs text-slate-400 dark:text-slate-500">{timeAgo(comment.timestamp)}</p>
                                        </div>
                                        <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{comment.text}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                         {post.comments.length === 0 && <p className="text-slate-400 dark:text-slate-500 text-center py-4">No comments yet.</p>}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PostCard;