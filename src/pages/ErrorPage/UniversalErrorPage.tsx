export default function UniversalErrorPage() {
  return (
    <div className="flex flex-col justify-center items-center m-6">
      <h1 className="text-4xl font-bold m-2">Oops! Something went wrong.</h1>
      <p>We encountered an unexpected error. Please try again later.</p>
      <div className="mt-8">
        <iframe
          src="https://giphy.com/embed/ku4DKHgQmyauWXbLMA"
          width="480"
          height="360"
          frameBorder="0"
          className="giphy-embed"
          allowFullScreen
        ></iframe>
       
      </div>
    </div>
  );
}