'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ToDo, getToDoById, updateToDo } from '@/services/todoService';
import { Bucket, getAllBuckets } from '@/services/bucketService';

interface EditTaskPageProps {
  params: { id: string };
}

export default function EditTaskPage({ params }: EditTaskPageProps) {
  const router = useRouter();
  const { id } = params;
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<Partial<ToDo>>({
    Title: '',
    Description: '',
    BucketID: undefined,
    DueDateTime: undefined,
    Priority: 'medium',
  });
  const [buckets, setBuckets] = useState<Bucket[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTaskAndBuckets = async () => {
      try {
        const accessToken = sessionStorage.getItem('accessToken');
        if (!accessToken) {
          router.push('/login');
          return;
        }

        const [taskData, bucketsData] = await Promise.all([
          getToDoById(Number(id)),
          getAllBuckets()
        ]);

        setFormData({
          Title: taskData.Title || '',
          Description: taskData.Description || '',
          BucketID: taskData.BucketID,
          DueDateTime: taskData.DueDateTime ? new Date(taskData.DueDateTime) : undefined,
          Priority: taskData.Priority || 'medium',
        });
        setBuckets(bucketsData);
      } catch (err) {
        console.error('Error fetching task or buckets:', err);
        setError('Failed to load task for editing.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTaskAndBuckets();
    }
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const accessToken = sessionStorage.getItem('accessToken');
      if (!accessToken) {
        router.push('/login');
        return;
      }

      await updateToDo(Number(id), {
        Title: formData.Title,
        Description: formData.Description,
        BucketID: formData.BucketID,
        DueDateTime: formData.DueDateTime ? new Date(formData.DueDateTime) : undefined,
        Priority: formData.Priority,
      });

      router.push('/tasks');
    } catch (err) {
      console.error('Error updating task:', err);
      alert('Failed to update task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-2xl mx-auto text-center py-4">Loading task...</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-2xl mx-auto text-center py-4 text-red-600">{error}</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit Task</h1>
          
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
                value={formData.Title || ''}
                onChange={(e) => setFormData({ ...formData, Title: e.target.value })}
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
                value={formData.Description || ''}
                onChange={(e) => setFormData({ ...formData, Description: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="bucketId" className="block text-sm font-medium text-gray-700">
                Bucket
              </label>
              <select
                id="bucketId"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.BucketID || ''}
                onChange={(e) => setFormData({ ...formData, BucketID: Number(e.target.value) || undefined })}
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
                value={formData.DueDateTime ? formData.DueDateTime.toISOString().split('T')[0] : ''}
                onChange={(e) => setFormData({ ...formData, DueDateTime: e.target.value ? new Date(e.target.value) : undefined })}
              />
            </div>

            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                Priority
              </label>
              <select
                id="priority"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.Priority || 'medium'}
                onChange={(e) => setFormData({ ...formData, Priority: e.target.value })}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
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
                {loading ? 'Updating...' : 'Update Task'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
} 