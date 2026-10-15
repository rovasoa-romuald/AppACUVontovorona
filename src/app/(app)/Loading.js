const Loading = () => {
    return (
        <div className="flex items-center justify-center w-full min-h-screen bg-gray-100">
            <div className="py-10 text-center">
                <div className="inline-block w-8 h-8 border-4 border-blue-600 border-solid rounded-full animate-spin border-r-transparent" />
                <p className="mt-2">Loading ...</p>
            </div>
        </div>
    );
};

export default Loading;
