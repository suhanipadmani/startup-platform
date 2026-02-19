import { useIdeas } from '../../hooks/useIdeas';
import { IdeaForm, type IdeaFormData } from '../../components/founder/IdeaForm';

const SubmitIdea = () => {
    const { createIdea, isCreating } = useIdeas();

    const onSubmit = (data: IdeaFormData) => {
        createIdea(data);
    };

    return (
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-sm">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Submit New Startup Idea</h1>
            <IdeaForm onSubmit={onSubmit} isLoading={isCreating} />
        </div>
    );
};

export default SubmitIdea;
