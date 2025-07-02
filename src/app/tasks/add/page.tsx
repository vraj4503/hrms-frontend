'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { createToDo } from '@/services/todoService';
import { getAllBuckets, Bucket } from '@/services/bucketService';
import { userApi, User } from '@/app/services/api';

export default function AddTaskPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [buckets, setBuckets] = useState<Bucket[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    bucketId: '',
    dueDate: '',
    priority: 'medium',
    assignTo: ''
  });
  const [sendNotification, setSendNotification] = useState(false);
  const [notificationTo, setNotificationTo] = useState('');

  useEffect(() => {
    const fetchBuckets = async () => {
      try {
        const accessToken = sessionStorage.getItem('accessToken');
        if (!accessToken) {
          router.push('/login');
          return;
        }

        const data = await getAllBuckets();
        setBuckets(data);
      } catch (error) {
        console.error('Error fetching buckets:', error);
      }
    };

    const fetchUsers = async () => {
      try {
        const cid = sessionStorage.getItem('cid');
        if (!cid) return;
        const response = await userApi.getByCompany(Number(cid));
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchBuckets();
    fetchUsers();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const accessToken = sessionStorage.getItem('accessToken');
      if (!accessToken) {
        router.push('/login');
        return;
      }
      const uid = sessionStorage.getItem('uid');
      const cid = sessionStorage.getItem('cid');
      const result = await createToDo({
        Title: formData.title,
        Description: formData.description,
        BucketID: formData.bucketId ? Number(formData.bucketId) : undefined,
        DueDateTime: formData.dueDate ? new Date(formData.dueDate) : undefined,
        Priority: formData.priority,
        AssignTo: formData.assignTo ? Number(formData.assignTo) : undefined,
        AssgnBy: uid ? Number(uid) : undefined,
        CID: cid ? Number(cid) : undefined,
        CreatedBy: uid ? Number(uid) : undefined,
        UpdatedBy: uid ? Number(uid) : undefined,
        StatusType: "A",
        ...(sendNotification && notificationTo
          ? { NotificationTo: notificationTo }
          : {}),
      });

      // result: { todo, whatsappStatus }
      if (result) {
        router.push('/tasks');
      } else {
        throw new Error('Failed to create task');
      }
    } catch (error) {
      console.error('Error creating task:', error);
      alert('Failed to create task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Add New Task</h1>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Task Title
              </label>
              <input
                type="text"
                id="title"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="bucketId" className="block text-sm font-medium text-gray-700">
                Bucket
              </label>
              <select
                id="bucketId"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.bucketId}
                onChange={(e) => setFormData({ ...formData, bucketId: e.target.value })}
              >
                <option value="">Select a bucket</option>
                {buckets.map((bucket) => (
                  <option key={bucket.BucketId} value={bucket.BucketId}>
                    {bucket.BucketName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
                Due Date
              </label>
              <input
                type="date"
                id="dueDate"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                Priority
              </label>
              <select
                id="priority"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label htmlFor="assignTo" className="block text-sm font-medium text-gray-700">
                Assign To (User)
              </label>
              <select
                id="assignTo"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.assignTo}
                onChange={(e) => setFormData({ ...formData, assignTo: e.target.value })}
              >
                <option value="">Select user</option>
                {users.map((user) => (
                  <option key={user.UID} value={user.UID}>
                    {user.Fname} {user.Lname} ({user.Email})
                  </option>
                ))}
              </select>
            </div>

            {/* Notification Option */}
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={sendNotification}
                  onChange={e => setSendNotification(e.target.checked)}
                />
                <span>Send notification to another user?</span>
              </label>
              {sendNotification && (
                <select
                  className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={notificationTo}
                  onChange={e => setNotificationTo(e.target.value)}
                >
                  <option value="">Select user</option>
                  {users.map(user => (
                    <option key={user.UID} value={user.UID}>
                      {user.Fname} {user.Lname} ({user.Email})
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Task'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
} 
