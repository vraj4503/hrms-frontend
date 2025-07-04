'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ToDo, getAllToDos, deleteToDo } from '@/services/todoService';
import { Bucket, getAllBuckets } from '@/services/bucketService';

export default function TasksPage() {
  const router = useRouter();
  const [todos, setTodos] = useState<ToDo[]>([]);
  const [buckets, setBuckets] = useState<Bucket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasksAndBuckets = async () => {
      try {
        const accessToken = sessionStorage.getItem('accessToken');
        const cid = sessionStorage.getItem('cid');
        if (!accessToken) {
          router.push('/login');
          return;
        }

        const [todosData, bucketsData] = await Promise.all([
          getAllToDos(cid ? Number(cid) : undefined),
          getAllBuckets()
        ]);
        setTodos(todosData);
        setBuckets(bucketsData);
      } catch (err) {
        // console.error('Error fetching tasks or buckets:', err);
        setError('Failed to load tasks or buckets.');
      } finally {
        setLoading(false);
      }
    };

    fetchTasksAndBuckets();
  }, [router]);

  const getBucketName = (bucketId?: number) => {
    if (!bucketId) return 'N/A';
    const bucket = buckets.find(b => b.BucketId === bucketId);
    return bucket ? bucket.BucketName : 'N/A';
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteToDo(id);
        setTodos(todos.filter(todo => todo.ToDoId !== id));
      } catch (err) {
        // console.error('Error deleting task:', err);
        alert('Failed to delete task. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-4">
        <div className="max-w-7xl mx-auto text-center py-4">Loading tasks...</div>
      </main>
    );
  }
  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-4">
        <div className="max-w-7xl mx-auto text-center py-4 text-red-600">{error}</div>
      </main>
    );
  }
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl p-8">
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold shadow"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-extrabold text-gray-800">Tasks</h1>
          <button
            onClick={() => router.push('/tasks/add')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition shadow"
          >
            Add New Task
          </button>
        </div>

        {todos.length === 0 ? (
          <div className="text-center py-4 text-gray-500">No tasks found</div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {todos.map((todo) => (
              <div
                key={todo.ToDoId}
                className="border rounded-xl p-6 bg-gradient-to-br from-white via-indigo-50 to-purple-50 hover:shadow-xl transition-shadow cursor-pointer flex flex-col justify-between min-h-[180px]"
              >
                <div>
                  <h3 className="text-xl font-bold text-indigo-700 flex items-center gap-2">
                    <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-3-3v6m9 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {todo.Title}
                  </h3>
                  <p className="text-gray-600 mt-2">{todo.Description}</p>
                </div>
                <div className="mt-4 text-sm text-gray-500 space-y-1">
                  <p><span className="font-semibold">Bucket:</span> {getBucketName(todo.BucketID)}</p>
                  <p><span className="font-semibold">Due Date:</span> {todo.DueDateTime ? new Date(todo.DueDateTime).toLocaleDateString() : 'N/A'}</p>
                  <p><span className="font-semibold">Priority:</span> {todo.Priority}</p>
                </div>
                <div className="mt-6 flex space-x-2">
                  <button
                    onClick={() => router.push(`/tasks/edit/${todo.ToDoId}`)}
                    className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 font-semibold text-sm shadow"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => todo.ToDoId && handleDelete(todo.ToDoId)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold text-sm shadow"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
} 