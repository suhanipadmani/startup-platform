import ProjectList from "../../components/admin/ProjectList";

const PendingReviews = () => {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Pending Reviews</h1>
            <ProjectList
                initialStatus="pending"
                title="Pending Projects"
                showFilters={false} // Since this is specifically the "Pending" page, maybe hide filters or keep them? User said "Pending Reviews" specifically.
            // Keeping filters false since the page implies it's only pending.
            />
        </div>
    );
};

export default PendingReviews;
