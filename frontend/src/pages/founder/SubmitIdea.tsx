import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { api } from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { ArrowLeft } from 'lucide-react';

export default function SubmitIdea() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        title: '',
        problemStatement: '',
        solution: '',
        targetMarket: '',
        techStack: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        console.log('Submitting idea with user:', user); // Debug log

        try {
            await api.post('/projects', {
                ...form,
                techStack: form.techStack.split(',').map(s => s.trim()).filter(s => s),
            });
            toast.success('Idea submitted successfully!');
            navigate('/founder');
        } catch (e: any) {
            toast.error(e.response?.data?.message || 'Failed to submit idea');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <button
                onClick={() => navigate('/founder')}
                className="mb-6 flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
            </button>

            <div className="bg-white shadow-xl rounded-lg overflow-hidden">
                <div className="px-6 py-8 border-b border-gray-200">
                    <h1 className="text-2xl font-bold text-gray-900">Submit New Startup Idea</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Pitch your idea to the incubator. Be concise and clear.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="px-6 py-8 space-y-6">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                            Project Title
                        </label>
                        <input
                            name="title"
                            id="title"
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="e.g., NextGen CRM"
                            value={form.title}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label htmlFor="problemStatement" className="block text-sm font-medium text-gray-700">
                            Problem Statement
                        </label>
                        <div className="mt-1">
                            <textarea
                                id="problemStatement"
                                name="problemStatement"
                                rows={3}
                                required
                                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md py-2 px-3"
                                placeholder="What problem are you solving?"
                                value={form.problemStatement}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="solution" className="block text-sm font-medium text-gray-700">
                            Proposed Solution
                        </label>
                        <div className="mt-1">
                            <textarea
                                id="solution"
                                name="solution"
                                rows={4}
                                required
                                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md py-2 px-3"
                                placeholder="How does your product solve the problem?"
                                value={form.solution}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div>
                            <label htmlFor="targetMarket" className="block text-sm font-medium text-gray-700">
                                Target Market
                            </label>
                            <input
                                name="targetMarket"
                                id="targetMarket"
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder="e.g., Small Business Owners"
                                value={form.targetMarket}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label htmlFor="techStack" className="block text-sm font-medium text-gray-700">
                                Tech Stack
                            </label>
                            <input
                                name="techStack"
                                id="techStack"
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder="React, Node.js, MongoDB"
                                value={form.techStack}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="pt-5 border-t border-gray-200">
                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={() => navigate('/founder')}
                                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70"
                            >
                                {loading ? 'Submitting...' : 'Submit Idea'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
