import { useParams, useNavigate } from 'react-router-dom';
import { useIdeas, useIdea } from '../../hooks/useIdeas';
import { IdeaForm, type IdeaFormData } from '../../components/founder/IdeaForm';
import { Loader } from '../../components/ui/Loader';
import { Button } from '../../components/ui/Button';
import { ArrowLeft } from 'lucide-react';

const EditIdea = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data: idea, isLoading: isLoadingIdea } = useIdea(id!);
    const { updateIdea, isUpdating } = useIdeas();

    if (isLoadingIdea) {
        return <div className="h-96 flex items-center justify-center"><Loader size="lg" /></div>;
    }

    if (!idea) {
        return <div className="text-center py-12">Idea not found</div>;
    }

    if (idea.status !== 'pending') {
        return (
            <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-sm text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Cannot Edit Idea</h1>
                <p className="text-gray-600 mb-6">This idea has already been processed and cannot be edited.</p>
                <Button onClick={() => navigate('/founder')}>Back to Dashboard</Button>
            </div>
        );
    }

    const onSubmit = (data: IdeaFormData) => {
        updateIdea({ id: id!, data });
    };

    return (
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-sm">
            <div className="mb-6">
                <Button
                    variant="ghost"
                    size="sm"
                    className="pl-0 hover:bg-transparent hover:text-blue-600 mb-4"
                    onClick={() => navigate('/founder')}
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                </Button>
                <h1 className="text-2xl font-bold text-gray-900">Edit Startup Idea</h1>
            </div>

            <IdeaForm
                initialData={idea}
                onSubmit={onSubmit}
                isLoading={isUpdating}
                submitLabel="Update Idea"
            />
        </div>
    );
};

export default EditIdea;
