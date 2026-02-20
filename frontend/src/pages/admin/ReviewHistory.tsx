import ProjectList from "../../components/admin/ProjectList";

const ReviewHistory = () => {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Review History</h1>
            <ProjectList
                initialStatus="approved,rejected"
                title="Historical Reviews"
                showFilters={true}
            />
        </div>
    );
};

export default ReviewHistory;
