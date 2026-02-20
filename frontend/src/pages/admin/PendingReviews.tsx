import ProjectList from "../../components/admin/ProjectList";

const PendingReviews = () => {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Pending Reviews</h1>
            <ProjectList
                initialStatus="pending"
                title="Pending Projects"
                showFilters={false}
            />
        </div>
    );
};

export default PendingReviews;
