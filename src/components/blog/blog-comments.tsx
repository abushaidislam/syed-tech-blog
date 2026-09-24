"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import {
  MessageSquare,
  Heart,
  Reply,
  Send,
  Sparkles,
  Bold,
  Code,
  Check,
  Share2,
  ChevronDown,
  ChevronUp,
  Eye,
  Edit3,
} from "lucide-react";

export interface CommentAuthor {
  name: string;
  image: string;
  role?: string;
  isAuthor?: boolean;
}

export interface CommentItem {
  id: string;
  author: CommentAuthor;
  content: string;
  createdAt: string;
  likes: number;
  userLiked?: boolean;
  replies?: CommentItem[];
}

interface BlogCommentsProps {
  postSlug?: string;
  postTitle?: string;
  className?: string;
}

// Initial discussions showcasing the tree-threaded structure
const getInitialComments = (slug: string = "default"): CommentItem[] => [
  {
    id: `c-1-${slug}`,
    author: {
      name: "Marcus Vance",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces",
      role: "Lead Systems Architect",
    },
    content:
      "The breakdown of the latency bottlenecks in this post is exceptional. Especially the section discussing cache invalidation and distributed state synchronization. Have you tested this approach under multi-region edge clusters?",
    createdAt: "2 days ago",
    likes: 14,
    userLiked: false,
    replies: [
      {
        id: `c-1-r-1-${slug}`,
        author: {
          name: "Syed",
          image: "/images/author-avatar.png",
          role: "Author",
          isAuthor: true,
        },
        content:
          "Great question Marcus! Yes, in production across three primary regions (us-east, eu-central, and ap-southeast), the edge stale-while-revalidate strategy kept p99 latency consistently under 22ms. We will publish a full benchmark report in an upcoming article!",
        createdAt: "1 day ago",
        likes: 9,
        userLiked: true,
      },
      {
        id: `c-1-r-2-${slug}`,
        author: {
          name: "Elena Rostova",
          image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=faces",
          role: "Frontend Engineer",
        },
        content: "Bookmarking this! The architectural diagrams made it super easy to follow along.",
        createdAt: "18 hours ago",
        likes: 4,
        userLiked: false,
      },
    ],
  },
  {
    id: `c-2-${slug}`,
    author: {
      name: "David Chen",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces",
      role: "DevOps Engineer",
    },
    content:
      "Really enjoyed the clarity here. Implementing similar patterns across our Next.js infra gave us a massive performance boost. Keep up the brilliant writing!",
    createdAt: "4 hours ago",
    likes: 6,
    userLiked: false,
    replies: [],
  },
];

// Simple markdown formatter
function FormattedContent({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);

  return (
    <div className="text-sm text-neutral-800 leading-relaxed font-normal">
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={i} className="font-semibold text-neutral-950">
              {part.slice(2, -2)}
            </strong>
          );
        }
        if (part.startsWith("`") && part.endsWith("`")) {
          return (
            <code
              key={i}
              className="rounded-md border border-neutral-200/90 bg-neutral-100 px-1.5 py-0.5 font-mono text-xs text-neutral-900"
            >
              {part.slice(1, -1)}
            </code>
          );
        }
        return part;
      })}
    </div>
  );
}

export function BlogComments({
  postSlug = "general",
  postTitle = "Article",
  className = "",
}: BlogCommentsProps) {
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [isInputExpanded, setIsInputExpanded] = useState(false);
  const [newCommentText, setNewCommentText] = useState("");
  const [previewMode, setPreviewMode] = useState(false);
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [collapsedThreads, setCollapsedThreads] = useState<Record<string, boolean>>({});
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const currentUser: CommentAuthor = {
    name: "You",
    image: "/images/author-avatar.png",
    role: "Reader",
  };

  // Load from localStorage or initialize with defaults
  useEffect(() => {
    const storageKey = `syed-blog-comments-${postSlug}`;
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setComments(JSON.parse(saved));
      } else {
        const defaults = getInitialComments(postSlug);
        setComments(defaults);
        localStorage.setItem(storageKey, JSON.stringify(defaults));
      }
    } catch {
      setComments(getInitialComments(postSlug));
    }
  }, [postSlug]);

  const saveComments = (updated: CommentItem[]) => {
    setComments(updated);
    try {
      localStorage.setItem(`syed-blog-comments-${postSlug}`, JSON.stringify(updated));
    } catch {
      // storage unavailable
    }
  };

  const handleAddComment = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newCommentText.trim()) return;

    const newComment: CommentItem = {
      id: `c-${Date.now()}`,
      author: currentUser,
      content: newCommentText.trim(),
      createdAt: "Just now",
      likes: 0,
      userLiked: false,
      replies: [],
    };

    saveComments([newComment, ...comments]);
    setNewCommentText("");
    setIsInputExpanded(false);
    setPreviewMode(false);
  };

  const handleAddReply = (parentId: string) => {
    if (!replyText.trim()) return;

    const newReply: CommentItem = {
      id: `r-${Date.now()}`,
      author: currentUser,
      content: replyText.trim(),
      createdAt: "Just now",
      likes: 0,
      userLiked: false,
    };

    const updated = comments.map((c) => {
      if (c.id === parentId) {
        return {
          ...c,
          replies: [...(c.replies || []), newReply],
        };
      }
      return c;
    });

    saveComments(updated);
    setReplyText("");
    setReplyingToId(null);
  };

  const handleToggleLike = (commentId: string, isReply: boolean = false, parentId?: string) => {
    const updated = comments.map((c) => {
      if (!isReply && c.id === commentId) {
        const userLiked = !c.userLiked;
        return {
          ...c,
          userLiked,
          likes: userLiked ? c.likes + 1 : Math.max(0, c.likes - 1),
        };
      }
      if (isReply && parentId && c.id === parentId) {
        const updatedReplies = c.replies?.map((r) => {
          if (r.id === commentId) {
            const userLiked = !r.userLiked;
            return {
              ...r,
              userLiked,
              likes: userLiked ? r.likes + 1 : Math.max(0, r.likes - 1),
            };
          }
          return r;
        });
        return { ...c, replies: updatedReplies };
      }
      return c;
    });

    saveComments(updated);
  };

  const handleCopyLink = (id: string) => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(`${window.location.href}#${id}`);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const toggleThread = (id: string) => {
    setCollapsedThreads((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const totalCount = useMemo(() => {
    return comments.reduce((acc, c) => acc + 1 + (c.replies?.length || 0), 0);
  }, [comments]);

  return (
    <section
      aria-label="Discussion and Comments"
      className={`border-t border-grid-border px-5 py-12 sm:px-12 ${className}`}
    >
      <div className="mx-auto max-w-3xl">
        {/* ========================================================
            1. SECTION HEADER (Dub Clean Aesthetic)
            ======================================================== */}
        <div className="mb-8 flex items-center justify-between border-b border-neutral-100 pb-5">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl border border-neutral-200/90 bg-neutral-50 text-neutral-900 shadow-2xs">
              <MessageSquare className="size-4 text-neutral-800" />
            </div>
            <div className="flex items-center gap-2.5">
              <h3 className="font-display text-lg font-semibold tracking-tight text-neutral-900 sm:text-xl">
                Discussion
              </h3>
              <span className="inline-flex items-center rounded-full border border-neutral-200/90 bg-neutral-100 px-2 py-0.5 text-2xs font-semibold text-neutral-700">
                {totalCount}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-neutral-400">
            <Sparkles className="size-3.5 text-neutral-400" />
            <span>Markdown supported</span>
          </div>
        </div>

        {/* ========================================================
            2. DUB COMMENT WRITING BOX (Smooth Expandable Input)
            ======================================================== */}
        <div className="mb-10">
          <div className="flex items-start gap-3.5">
            {/* User Avatar */}
            <div className="relative size-9 shrink-0 overflow-hidden rounded-full border border-neutral-200 bg-neutral-100 shadow-2xs">
              <Image
                src={currentUser.image}
                alt={currentUser.name}
                width={36}
                height={36}
                className="size-full object-cover"
              />
            </div>

            {/* Input Box Container */}
            <div className="flex-1">
              <div
                className={`overflow-hidden rounded-2xl border transition-all duration-200 ${
                  isInputExpanded
                    ? "border-neutral-900 bg-white ring-2 ring-neutral-900/5 shadow-xs"
                    : "border-neutral-200/80 bg-neutral-50/60 hover:border-neutral-300 hover:bg-white"
                }`}
              >
                {/* Textarea or Preview */}
                <div className="p-3.5">
                  {previewMode ? (
                    <div className="min-h-[72px] rounded-lg bg-neutral-50/50 p-3">
                      {newCommentText.trim() ? (
                        <FormattedContent text={newCommentText} />
                      ) : (
                        <p className="text-xs italic text-neutral-400">
                          Nothing to preview yet. Type markdown above!
                        </p>
                      )}
                    </div>
                  ) : (
                    <textarea
                      ref={textareaRef}
                      value={newCommentText}
                      onFocus={() => setIsInputExpanded(true)}
                      onChange={(e) => setNewCommentText(e.target.value)}
                      placeholder="Add to the discussion..."
                      rows={isInputExpanded ? 3 : 1}
                      className="w-full resize-none bg-transparent text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-hidden transition-all duration-150"
                    />
                  )}
                </div>

                {/* Expanded Action Toolbar */}
                <AnimatePresence>
                  {isInputExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                      className="flex items-center justify-between border-t border-neutral-100 bg-neutral-50/50 px-3.5 py-2.5"
                    >
                      {/* Markdown helper icons */}
                      <div className="flex items-center gap-1 text-neutral-400">
                        <button
                          type="button"
                          onClick={() => setNewCommentText((prev) => prev + " **bold** ")}
                          title="Add bold text"
                          className="rounded p-1 hover:bg-neutral-200/60 hover:text-neutral-800 transition-colors"
                        >
                          <Bold className="size-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setNewCommentText((prev) => prev + " `code` ")}
                          title="Add inline code"
                          className="rounded p-1 hover:bg-neutral-200/60 hover:text-neutral-800 transition-colors"
                        >
                          <Code className="size-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setPreviewMode(!previewMode)}
                          className="ml-1 inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-2xs font-medium text-neutral-600 hover:bg-neutral-200/60 transition-colors"
                        >
                          {previewMode ? (
                            <>
                              <Edit3 className="size-3" />
                              <span>Write</span>
                            </>
                          ) : (
                            <>
                              <Eye className="size-3" />
                              <span>Preview</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Cancel & Submit Buttons */}
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            if (!newCommentText.trim()) {
                              setIsInputExpanded(false);
                              setPreviewMode(false);
                            } else {
                              setNewCommentText("");
                              setIsInputExpanded(false);
                              setPreviewMode(false);
                            }
                          }}
                          className="rounded-lg px-3 py-1.5 text-xs font-medium text-neutral-500 hover:bg-neutral-200/50 hover:text-neutral-900 transition-colors"
                        >
                          Cancel
                        </button>

                        <motion.button
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.96 }}
                          type="button"
                          disabled={!newCommentText.trim()}
                          onClick={() => handleAddComment()}
                          className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-neutral-900 bg-neutral-900 px-4 py-1.5 text-xs font-medium text-white shadow-2xs transition-all hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                        >
                          <span>Comment</span>
                          <Send className="size-3" />
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================
            3. TREE-THREADED COMMENTS STREAM (Exact YouTube/Reddit UX)
            ======================================================== */}
        <div className="space-y-8">
          <AnimatePresence initial={false}>
            {comments.map((comment) => {
              const isCollapsed = Boolean(collapsedThreads[comment.id]);
              const replies = comment.replies || [];
              const hasReplies = replies.length > 0;

              return (
                <motion.div
                  key={comment.id}
                  id={comment.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="group/thread relative"
                >
                  {/* Top-Level Parent Comment (Clean Stream Item, No Heavy Card) */}
                  <div className="flex items-start gap-3.5">
                    {/* Parent Author Avatar */}
                    <div className="relative size-9 shrink-0 overflow-hidden rounded-full border border-neutral-200/90 bg-neutral-100 shadow-2xs">
                      <Image
                        src={comment.author.image}
                        alt={comment.author.name}
                        width={36}
                        height={36}
                        className="size-full object-cover"
                      />
                    </div>

                    {/* Content Column */}
                    <div className="flex-1 min-w-0">
                      {/* Author Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-display text-sm font-semibold text-neutral-900">
                            {comment.author.name}
                          </span>
                          {comment.author.isAuthor && (
                            <span className="rounded-md border border-neutral-900 bg-neutral-900 px-1.5 py-0.2 text-[10px] font-semibold text-white">
                              Author
                            </span>
                          )}
                          {comment.author.role && !comment.author.isAuthor && (
                            <span className="hidden sm:inline-block rounded-md border border-neutral-200 bg-neutral-100 px-1.5 py-0.2 text-[10px] font-medium text-neutral-600">
                              {comment.author.role}
                            </span>
                          )}
                          <span className="text-2xs text-neutral-400">• {comment.createdAt}</span>
                        </div>

                        {/* Share link */}
                        <button
                          type="button"
                          onClick={() => handleCopyLink(comment.id)}
                          className="opacity-0 group-hover/thread:opacity-100 inline-flex size-6 items-center justify-center rounded-md text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-all"
                          title="Copy link to comment"
                        >
                          {copiedId === comment.id ? (
                            <Check className="size-3 text-emerald-600" />
                          ) : (
                            <Share2 className="size-3" />
                          )}
                        </button>
                      </div>

                      {/* Comment Text */}
                      <div className="mt-1.5">
                        <FormattedContent text={comment.content} />
                      </div>

                      {/* Action Row (Like, Reply, View Replies) */}
                      <div className="mt-2.5 flex items-center gap-3 text-xs">
                        <motion.button
                          whileTap={{ scale: 1.25 }}
                          type="button"
                          onClick={() => handleToggleLike(comment.id)}
                          className={`inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium transition-colors ${
                            comment.userLiked
                              ? "bg-rose-50 text-rose-600"
                              : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800"
                          }`}
                        >
                          <Heart
                            className={`size-3.5 ${
                              comment.userLiked ? "fill-rose-500 text-rose-500" : ""
                            }`}
                          />
                          <span>{comment.likes}</span>
                        </motion.button>

                        <button
                          type="button"
                          onClick={() =>
                            setReplyingToId(replyingToId === comment.id ? null : comment.id)
                          }
                          className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800 transition-colors"
                        >
                          <Reply className="size-3.5" />
                          <span>Reply</span>
                        </button>

                        {hasReplies && (
                          <button
                            type="button"
                            onClick={() => toggleThread(comment.id)}
                            className="inline-flex items-center gap-1 text-xs font-medium text-neutral-500 hover:text-neutral-900 transition-colors ml-1"
                          >
                            <span>
                              {isCollapsed
                                ? `View ${replies.length} ${replies.length === 1 ? "reply" : "replies"}`
                                : "Hide replies"}
                            </span>
                            {isCollapsed ? (
                              <ChevronDown className="size-3.5" />
                            ) : (
                              <ChevronUp className="size-3.5" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* ========================================================
                      INLINE REPLY BOX (Curves out from parent line)
                      ======================================================== */}
                  <AnimatePresence>
                    {replyingToId === comment.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="relative ml-[17px] mt-3 pl-8"
                      >
                        {/* L-shaped curved branch line into inline reply input */}
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute -left-0 top-4 h-4 w-6 rounded-bl-xl border-b-[1.5px] border-l-[1.5px] border-neutral-300"
                        />

                        <div className="rounded-xl border border-neutral-300 bg-white p-3 shadow-2xs">
                          <textarea
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder={`Reply to ${comment.author.name}...`}
                            rows={2}
                            autoFocus
                            className="w-full resize-none bg-transparent text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-hidden"
                          />
                          <div className="mt-2 flex items-center justify-end gap-2 border-t border-neutral-100 pt-2">
                            <button
                              type="button"
                              onClick={() => {
                                setReplyingToId(null);
                                setReplyText("");
                              }}
                              className="rounded-lg px-2.5 py-1 text-2xs font-medium text-neutral-500 hover:bg-neutral-100"
                            >
                              Cancel
                            </button>
                            <motion.button
                              whileTap={{ scale: 0.95 }}
                              type="button"
                              disabled={!replyText.trim()}
                              onClick={() => handleAddReply(comment.id)}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-neutral-900 px-3 py-1 text-2xs font-medium text-white shadow-2xs hover:bg-neutral-800 disabled:opacity-40"
                            >
                              <span>Send</span>
                              <Send className="size-2.5" />
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* ========================================================
                      TREE-THREADED REPLIES (Exact YouTube/Reddit Structure)
                      ======================================================== */}
                  {hasReplies && !isCollapsed && (
                    <div className="relative ml-[17px] mt-2 pl-8 space-y-4">
                      {/* 1. Continuous Vertical Tree Line running down from parent avatar */}
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute left-0 top-0 bottom-4 w-[1.5px] bg-neutral-200 group-hover/thread:bg-neutral-300 transition-colors"
                      />

                      {/* Reply Items */}
                      {replies.map((reply) => (
                        <div key={reply.id} id={reply.id} className="group/reply relative">
                          {/* 2. L-shaped Curved Branch Line into each reply avatar */}
                          <div
                            aria-hidden="true"
                            className="pointer-events-none absolute -left-8 top-3.5 h-3.5 w-6 rounded-bl-xl border-b-[1.5px] border-l-[1.5px] border-neutral-200 group-hover/thread:border-neutral-300 transition-colors"
                          />

                          {/* Reply Stream Item */}
                          <div className="flex items-start gap-3">
                            {/* Reply Avatar */}
                            <div className="relative size-7 shrink-0 overflow-hidden rounded-full border border-neutral-200 bg-neutral-100 shadow-2xs">
                              <Image
                                src={reply.author.image}
                                alt={reply.author.name}
                                width={28}
                                height={28}
                                className="size-full object-cover"
                              />
                            </div>

                            {/* Reply Content Column */}
                            <div className="flex-1 min-w-0">
                              {/* Reply Author Header */}
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-display text-xs font-semibold text-neutral-900">
                                    {reply.author.name}
                                  </span>
                                  {reply.author.isAuthor && (
                                    <span className="rounded-md border border-neutral-900 bg-neutral-900 px-1.5 py-0.2 text-[9px] font-semibold text-white">
                                      Author
                                    </span>
                                  )}
                                  {reply.author.role && !reply.author.isAuthor && (
                                    <span className="hidden sm:inline-block rounded-md border border-neutral-200 bg-neutral-100 px-1.5 py-0.2 text-[9px] font-medium text-neutral-600">
                                      {reply.author.role}
                                    </span>
                                  )}
                                  <span className="text-[10px] text-neutral-400">• {reply.createdAt}</span>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => handleCopyLink(reply.id)}
                                  className="opacity-0 group-hover/reply:opacity-100 inline-flex size-5 items-center justify-center rounded text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-all"
                                  title="Copy link to reply"
                                >
                                  {copiedId === reply.id ? (
                                    <Check className="size-2.5 text-emerald-600" />
                                  ) : (
                                    <Share2 className="size-2.5" />
                                  )}
                                </button>
                              </div>

                              {/* Reply Text */}
                              <div className="mt-1">
                                <FormattedContent text={reply.content} />
                              </div>

                              {/* Reply Like Action */}
                              <div className="mt-2 flex items-center gap-2 text-xs">
                                <motion.button
                                  whileTap={{ scale: 1.25 }}
                                  type="button"
                                  onClick={() => handleToggleLike(reply.id, true, comment.id)}
                                  className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-2xs font-medium transition-colors ${
                                    reply.userLiked
                                      ? "bg-rose-50 text-rose-600"
                                      : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800"
                                  }`}
                                >
                                  <Heart
                                    className={`size-3 ${
                                      reply.userLiked ? "fill-rose-500 text-rose-500" : ""
                                    }`}
                                  />
                                  <span>{reply.likes}</span>
                                </motion.button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
