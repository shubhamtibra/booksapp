export default function LoadingTransition({ isPending }) {
  return (
    isPending && (
      <div className="top-1/2 left-1/2 fixed text-center align-middle h-screen w-screen z-50">
        <div className="animate-spin-slow rounded-full h-32 w-32 border-t-2 border-b-2 border-dark-primary"></div>
      </div>
    )
  );
}
