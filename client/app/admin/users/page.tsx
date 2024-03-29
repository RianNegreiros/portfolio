'use client'

import AdminCreateUserModal from '@/app/components/AdminCreateUserModal'
import AdminDeleteModal from '@/app/components/AdminDeleteModal'
import { CreateUser, UserAdminData } from '@/app/models'
import { createUser, deleteAdminUser, getAdminUsers } from '@/app/utils/api'
import Link from 'next/link'
import { useEffect, useState } from 'react'

async function fetchData() {
  const result = await getAdminUsers()
  return result
}

export default function UsersPage() {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState<string>('')
  const [data, setData] = useState<UserAdminData[]>([])

  useEffect(() => {
    async function getData() {
      const users = await fetchData()
      setData(users)
    }
    getData()
  }, [])

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false)
    setSelectedUserId('')
  }

  const handleDeleteConfirm = async () => {
    setIsDeleteModalOpen(false)
    await deleteAdminUser(selectedUserId)
    const users = await fetchData()
    setData(users)
  }

  const openDeleteModal = (userId: string) => {
    setIsDeleteModalOpen(true)
    setSelectedUserId(userId)
  }

  const openCreateUserModal = () => {
    setIsCreateUserModalOpen(true)
  }

  const handleCreate = async (formData: CreateUser) => {
    try {
      await createUser(formData)
      const users = await fetchData()
      setData(users)
    } catch (error) {
      console.error('Error creating user')
    }
  }

  const closeCreateUserModal = () => {
    setIsCreateUserModalOpen(false)
  }

  return (
    <>
      <section className='bg-gray-50 p-3 antialiased dark:bg-gray-900 sm:p-5'>
        <div className='mx-auto max-w-screen-2xl px-4 lg:px-12'>
          <div className='relative overflow-hidden bg-white shadow-md dark:bg-gray-800 sm:rounded-lg'>
            <div className='flex flex-col space-y-3 p-4 md:flex-row md:items-center md:justify-between md:space-x-4 md:space-y-0'>
              <div className='flex flex-1 items-center space-x-2'>
                <h5>
                  <span className='text-gray-500'>All Users: </span>
                  <span className='dark:text-white'>{data.length}</span>
                </h5>
              </div>
            </div>
            <div className='mx-4 flex flex-col items-stretch justify-between space-y-3 border-t py-4 dark:border-gray-700 md:flex-row md:items-center md:space-x-3 md:space-y-0'>
              <div className='w-full md:w-1/2'>
                <form className='flex items-center'>
                  <label htmlFor='simple-search' className='sr-only'>
                    Search
                  </label>
                  <div className='relative w-full'>
                    <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
                      <svg
                        aria-hidden='true'
                        className='h-5 w-5 text-gray-500 dark:text-gray-400'
                        fill='currentColor'
                        viewBox='0 0 20 20'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path
                          fillRule='evenodd'
                          clipRule='evenodd'
                          d='M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z'
                        />
                      </svg>
                    </div>
                    <input
                      type='text'
                      id='simple-search'
                      placeholder='Search for users'
                      required
                      className='focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-500 dark:focus:border-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2 pl-10 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400'
                    />
                  </div>
                </form>
              </div>
              <div className='flex w-full flex-shrink-0 flex-col items-stretch justify-end space-y-2 md:w-auto md:flex-row md:items-center md:space-x-3 md:space-y-0'>
                <button
                  onClick={() => openCreateUserModal()}
                  className='bg-primary-700 hover:bg-primary-800 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-white focus:outline-none focus:ring-4'
                >
                  <svg
                    className='-ml-1 mr-1.5 h-3.5 w-3.5'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                    xmlns='http://www.w3.org/2000/svg'
                    aria-hidden='true'
                  >
                    <path
                      clipRule='evenodd'
                      fillRule='evenodd'
                      d='M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z'
                    />
                  </svg>
                  Add user
                </button>
                <div
                  id='filterDropdown'
                  className='right-0 z-10 hidden w-80 rounded-lg bg-white px-3 pt-1 shadow dark:bg-gray-700'
                >
                  <div className='pb-2 pt-3'>
                    <label htmlFor='input-group-search' className='sr-only'>
                      Search
                    </label>
                    <div className='relative'>
                      <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4'>
                        <svg
                          className='h-4 w-4 text-gray-500 dark:text-gray-400'
                          aria-hidden='true'
                          fill='currentColor'
                          viewBox='0 0 20 20'
                          xmlns='http://www.w3.org/2000/svg'
                        >
                          <path
                            fillRule='evenodd'
                            d='M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z'
                            clipRule='evenodd'
                          />
                        </svg>
                      </div>
                      <input
                        type='text'
                        id='input-group-search'
                        className='focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-500 dark:focus:border-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2 pl-10 text-sm text-gray-900 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400'
                        placeholder='Search keywords...'
                      />
                    </div>
                  </div>
                  <div
                    id='accordion-flush'
                    data-accordion='collapse'
                    data-active-classes='text-black dark:text-white'
                    data-inactive-classes='text-gray-500 dark:text-gray-400'
                  ></div>
                </div>
              </div>
            </div>
            <div className='overflow-x-auto'>
              <table className='w-full text-left text-sm text-gray-500 dark:text-gray-400'>
                <thead className='bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400'>
                  <tr>
                    <th scope='col' className='p-4'>
                      Id
                    </th>
                    <th scope='col' className='p-4'>
                      Email
                    </th>
                    <th scope='col' className='p-4'>
                      Name
                    </th>
                    <th scope='col' className='p-4'>
                      Posts Count
                    </th>
                    <th scope='col' className='p-4'>
                      Comments Count
                    </th>
                    <th scope='col' className='p-4'>
                      Role
                    </th>
                    <th scope='col' className='p-4'>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((user) => (
                    <tr
                      key={user.id}
                      className='border-b hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700'
                    >
                      <th
                        scope='row'
                        className='truncate whitespace-nowrap px-4 py-3 font-medium text-gray-900 dark:text-white'
                      >
                        <div className='mr-3 flex items-center'>{user.id}</div>
                      </th>
                      <td className='px-4 py-3'>{user.email}</td>
                      <td className='whitespace-nowrap px-4 py-3 font-medium text-gray-900 dark:text-white'>
                        <div className='flex items-center'>{user.username}</div>
                      </td>
                      <td className='whitespace-nowrap px-4 py-3 font-medium text-gray-900 dark:text-white'>
                        {user.posts.length}
                      </td>
                      <td className='whitespace-nowrap px-4 py-3 font-medium text-gray-900 dark:text-white'>
                        {user.comments.length}
                      </td>
                      <td className='whitespace-nowrap px-4 py-3 font-medium text-gray-900 dark:text-white'>
                        {user.isAdmin ? 'Admin' : 'User'}
                      </td>
                      <td className='whitespace-nowrap px-4 py-3 font-medium text-gray-900 dark:text-white'>
                        <div className='flex items-center space-x-4'>
                          <Link
                            href={`/edit-user/${user.id}`}
                            className='bg-primary-700 hover:bg-primary-800 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 flex items-center rounded-lg px-3 py-2 text-center text-sm font-medium text-white focus:outline-none focus:ring-4'
                          >
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              className='-ml-0.5 mr-2 h-4 w-4'
                              viewBox='0 0 20 20'
                              fill='currentColor'
                              aria-hidden='true'
                            >
                              <path d='M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z' />
                              <path
                                fillRule='evenodd'
                                d='M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z'
                                clipRule='evenodd'
                              />
                            </svg>
                            Edit
                          </Link>
                          <button
                            type='button'
                            onClick={() => openDeleteModal(user.id)}
                            className='flex items-center rounded-lg bg-red-700 px-3 py-2 text-center text-sm font-medium text-white hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800'
                          >
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              className='-ml-0.5 mr-2 h-4 w-4'
                              viewBox='0 0 20 20'
                              fill='currentColor'
                              aria-hidden='true'
                            >
                              <path
                                fillRule='evenodd'
                                d='M5.293 4.293a1 1 0 011.414 0L10 8.586l3.293-3.293a1 1 0 011.414 0 1 1 0 010 1.414L11.414 10l3.293 3.293a1 1 0 010 1.414 1 1 0 01-1.414 0L10 11.414l-3.293 3.293a1 1 0 01-1.414 0 1 1 0 010-1.414L8.586 10 5.293 6.707a1 1 0 010-1.414z'
                                clipRule='evenodd'
                              />
                            </svg>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <AdminCreateUserModal
        isOpen={isCreateUserModalOpen}
        onClose={closeCreateUserModal}
        onCreateUser={handleCreate}
      />

      {isDeleteModalOpen && (
        <AdminDeleteModal
          onCancel={handleDeleteCancel}
          onDelete={handleDeleteConfirm}
          isOpen={isDeleteModalOpen}
        />
      )}
    </>
  )
}
