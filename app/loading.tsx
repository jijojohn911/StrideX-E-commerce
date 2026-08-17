const loading = () => {
    return (
        <div className='flex justify-center items-center h-screen'>
            <div className='motion-safe-spinner animate-spin  rounded-full h-32 w-32 border-t-2 border-b-2  border-ink' />
        </div>
    )
}

export default loading