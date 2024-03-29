import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { Comment, CommentData, InputReply } from '@/app/models'
import {
  addCommentToPost,
  addReplyToComment,
  getCommentsForPost,
} from '@/app/utils/api'
import { useAuth } from '@/app/contexts/AuthContext'
import AuthLinks from './AuthLinks'
import { usePathname } from 'next/navigation'

interface CommentSectionProps {
  slug: string
  comments: Comment[]
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>
}

const CommentSection = ({
  slug,
  comments,
  setComments,
}: CommentSectionProps) => {
  const { isLogged } = useAuth()
  const pathname = usePathname()
  const [formData, setFormData] = useState<CommentData>({
    postSlug: slug,
    content: '',
    authorId: '',
  })
  const [replyData, setReplyData] = useState<InputReply>({
    id: '',
    content: '',
    authorId: '',
  })
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [showReplyForm, setShowReplyForm] = useState<boolean>(false)

  const handleReplyClick = (commentId: string) => {
    setReplyingTo(commentId)
    setShowReplyForm(!showReplyForm)
  }

  useEffect(() => {
    setComments(comments)
  }, [comments, setComments])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      await addCommentToPost(formData)
      const response = await getCommentsForPost(slug)
      setComments(response.data)
      setFormData((prevData) => ({ ...prevData, content: '' }))
    } catch (error) {
      console.error('Failed to create comment:', error)
    }
  }

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    setFormData((prevData) => ({ ...prevData, [name]: value }))
  }

  const handleReplySubmit = async (
    e: FormEvent<HTMLFormElement>,
    commentId: string,
  ) => {
    e.preventDefault()
    try {
      await addReplyToComment(commentId, replyData)
      const response = await getCommentsForPost(slug)
      setComments(response.data)
      setReplyData((prevData: InputReply) => ({ ...prevData, content: '' }))
      setReplyingTo(null)
    } catch (error) {
      console.error('Failed to create reply:', error)
    }
  }

  const handleReplyChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    setReplyData((prevData: InputReply) => ({ ...prevData, [name]: value }))
  }

  return (
    <main className='bg-white py-4 dark:bg-gray-900'>
      <div className='mx-auto max-w-screen-xl px-4 '>
        <article className='mx-auto w-full max-w-2xl'>
          <section className='not-format'>
            <div className='mb-6 flex items-center justify-between'>
              <h2 className='text-lg font-bold text-gray-900 dark:text-white lg:text-2xl'>
                Comentários ({comments.length})
              </h2>
            </div>
            <form className='mb-6' onSubmit={handleSubmit}>
              <div className='mb-4 rounded-lg rounded-t-lg border border-gray-300 bg-white px-4 py-2 dark:border-gray-700 dark:bg-gray-800'>
                <label htmlFor='comment' className='sr-only'>
                  Seu comentário
                </label>
                <textarea
                  id='comment'
                  name='content'
                  rows={6}
                  disabled={!isLogged}
                  placeholder={
                    isLogged
                      ? 'Escreva um comentário...'
                      : 'Faça login para postar um comentário'
                  }
                  className='w-full border-0 bg-white px-0 text-sm text-gray-900 focus:ring-0 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400'
                  required
                  onChange={handleChange}
                  value={formData.content}
                ></textarea>
              </div>
              {isLogged ? (
                <button
                  type='submit'
                  className='inline-flex items-center rounded-lg bg-dracula-purple px-4 py-2.5 text-center text-xs font-medium text-white hover:bg-dracula-purple-800 focus:ring-4 focus:ring-dracula-purple-200 dark:focus:ring-dracula-purple-900'
                >
                  Postar comentário
                </button>
              ) : (
                <AuthLinks pathname={pathname} />
              )}
            </form>
            {comments.map((comment) => (
              <article
                key={comment.id}
                className='rounded-lg bg-white p-6 text-base dark:bg-gray-900'
              >
                <footer className='mb-2 flex items-center justify-between'>
                  <div className='flex items-center'>
                    <p className='mr-3 inline-flex items-center text-sm font-semibold text-gray-900 dark:text-white'>
                      {comment.authorUsername}
                    </p>
                    <p className='text-sm text-gray-600 dark:text-gray-400'>
                      <time
                        dateTime={comment.createdAt}
                        title={new Date(comment.createdAt).toLocaleDateString()}
                      >
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </time>
                    </p>
                  </div>
                </footer>
                <p>{comment.content}</p>
                <div className='mt-4 flex items-center space-x-4'>
                  <button
                    type='button'
                    className={`flex items-center text-sm font-medium text-gray-500 hover:underline dark:text-gray-400 ${!isLogged ? 'cursor-not-allowed opacity-50' : ''}`}
                    onClick={() => handleReplyClick(comment.id)}
                    disabled={!isLogged}
                  >
                    <svg
                      className='mr-1.5 h-3 w-3'
                      aria-hidden='true'
                      xmlns='http://www.w3.org/2000/svg'
                      fill='currentColor'
                      viewBox='0 0 20 18'
                    >
                      <path d='M18 0H2a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h2v4a1 1 0 0 0 1.707.707L10.414 13H18a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5 4h2a1 1 0 1 1 0 2h-2a1 1 0 1 1 0-2ZM5 4h5a1 1 0 1 1 0 2H5a1 1 0 0 1 0-2Zm2 5H5a1 1 0 0 1 0-2h2a1 1 0 0 1 0 2Zm9 0h-6a1 1 0 0 1 0-2h6a1 1 0 1 1 0 2Z' />
                    </svg>
                    Reply
                  </button>
                </div>
                {replyingTo === comment.id && showReplyForm && (
                  <form
                    onSubmit={(e) => handleReplySubmit(e, comment.id)}
                    className='mt-4'
                  >
                    <input
                      type='text'
                      name='content'
                      value={replyData.content}
                      onChange={handleReplyChange}
                      className='w-full rounded-md border p-2'
                    />
                    <button
                      type='submit'
                      className='mt-2 rounded-md bg-dracula-purple px-4 py-2 text-white'
                    >
                      Reply
                    </button>
                  </form>
                )}
                {comment.replies &&
                  comment.replies.map((reply) => (
                    <article
                      key={reply.id}
                      className='ml-6 rounded-lg bg-white p-6 text-base dark:bg-gray-900 lg:ml-12'
                    >
                      <footer className='mb-2 flex items-center justify-between'>
                        <div className='flex items-center'>
                          <p className='mr-3 inline-flex items-center text-sm font-semibold text-gray-900 dark:text-white'>
                            {reply.authorUsername}
                          </p>
                          <p className='text-sm text-gray-600 dark:text-gray-400'>
                            <time
                              dateTime={reply.createdAt}
                              title={new Date(
                                reply.createdAt,
                              ).toLocaleDateString()}
                            >
                              {new Date(reply.createdAt).toLocaleDateString()}
                            </time>
                          </p>
                        </div>
                      </footer>
                      <p>{reply.content}</p>
                      <div className='mt-4 flex items-center space-x-4'>
                        <button
                          type='button'
                          className={`flex items-center text-sm font-medium text-gray-500 hover:underline dark:text-gray-400 ${!isLogged ? 'cursor-not-allowed opacity-50' : ''}`}
                          onClick={() => handleReplyClick(reply.id)}
                          disabled={!isLogged}
                        >
                          <svg
                            className='mr-1.5 h-3 w-3'
                            aria-hidden='true'
                            xmlns='http://www.w3.org/2000/svg'
                            fill='currentColor'
                            viewBox='0 0 20 18'
                          >
                            <path d='M18 0H2a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h2v4a1 1 0 0 0 1.707.707L10.414 13H18a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5 4h2a1 1 0 1 1 0 2h-2a1 1 0 1 1 0-2ZM5 4h5a1 1 0 1 1 0 2H5a1 1 0 0 1 0-2Zm2 5H5a1 1 0 0 1 0-2h2a1 1 0 0 1 0 2Zm9 0h-6a1 1 0 0 1 0-2h6a1 1 0 1 1 0 2Z' />
                          </svg>
                          Reply
                        </button>
                      </div>
                      {replyingTo === reply.id && showReplyForm && (
                        <form
                          onSubmit={(e) => handleReplySubmit(e, comment.id)}
                        >
                          <input
                            type='text'
                            name='content'
                            value={replyData.content}
                            onChange={handleReplyChange}
                            className='w-full rounded-md border p-2'
                          />
                          <button
                            type='submit'
                            className='mt-2 rounded-md bg-dracula-purple px-4 py-2 text-white'
                          >
                            Reply
                          </button>
                        </form>
                      )}
                    </article>
                  ))}
              </article>
            ))}
          </section>
        </article>
      </div>
    </main>
  )
}

export default CommentSection
