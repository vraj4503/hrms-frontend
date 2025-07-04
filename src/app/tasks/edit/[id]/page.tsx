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
        // console.error('Error fetching task or buckets:', err);
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
      // console.error('Error updating task:', err);
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

    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-4">
      <div className="w-full max-w-xl bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-10 border border-blue-100 animate-fade-in">
        <h1 className="text-4xl font-extrabold text-blue-700 mb-8 text-center drop-shadow">Edit Task</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-base font-semibold text-gray-700 mb-1">Task Title</label>
            <input
              type="text"
              id="title"
              required
              className="mt-1 block w-full rounded-xl border-2 border-blue-200 shadow focus:border-blue-500 focus:ring-2 focus:ring-blue-200 px-4 py-2 text-lg transition-all"
              value={formData.Title || ''}
              onChange={(e) => setFormData({ ...formData, Title: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-base font-semibold text-gray-700 mb-1">Description</label>
            <textarea
              id="description"
              rows={4}
              className="mt-1 block w-full rounded-xl border-2 border-blue-200 shadow focus:border-blue-500 focus:ring-2 focus:ring-blue-200 px-4 py-2 text-lg transition-all resize-none"
              value={formData.Description || ''}
              onChange={(e) => setFormData({ ...formData, Description: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="bucketId" className="block text-base font-semibold text-gray-700 mb-1">Bucket</label>
            <select
              id="bucketId"
              className="mt-1 block w-full rounded-xl border-2 border-blue-200 shadow focus:border-blue-500 focus:ring-2 focus:ring-blue-200 px-4 py-2 text-lg transition-all"
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
            <label htmlFor="dueDate" className="block text-base font-semibold text-gray-700 mb-1">Due Date</label>
            <input
              type="date"
              id="dueDate"
              className="mt-1 block w-full rounded-xl border-2 border-blue-200 shadow focus:border-blue-500 focus:ring-2 focus:ring-blue-200 px-4 py-2 text-lg transition-all"
              value={formData.DueDateTime ? formData.DueDateTime.toISOString().split('T')[0] : ''}
              onChange={(e) => setFormData({ ...formData, DueDateTime: e.target.value ? new Date(e.target.value) : undefined })}
            />
          </div>
          <div>
            <label htmlFor="priority" className="block text-base font-semibold text-gray-700 mb-1">Priority</label>
            <select
              id="priority"
              className="mt-1 block w-full rounded-xl border-2 border-blue-200 shadow focus:border-blue-500 focus:ring-2 focus:ring-blue-200 px-4 py-2 text-lg transition-all"
              value={formData.Priority || 'medium'}
              onChange={(e) => setFormData({ ...formData, Priority: e.target.value })}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 text-blue-700 bg-blue-100 rounded-xl hover:bg-blue-200 font-semibold shadow focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-bold shadow hover:from-blue-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update Task'}
            </button>
          </div>
        </form>

      </div>
    </main>
  );
} 