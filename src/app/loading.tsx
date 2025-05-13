

const Loading = () => {
    return(
        <div className="min-h-screen">
    <div className="fixed top-0 left-0 w-full h-full flex flex-col justify-center items-center bg-gray-50 opacity-75 z-50">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-500"></div>
      <p className="mt-4 text-xl font-semibold text-gray-700">
        Loading...
      </p>
    </div>
        </div>
    )
}

export default Loading