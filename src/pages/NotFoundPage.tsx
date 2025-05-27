export default function NotFoundPage() {
    return (
      <div className="flex flex-col justify-center justify-items-center m-6">
        <h1 className="text-4xl font-bold m-2">404 Not Found</h1>
        <p>You landed on a page that just doesn't work right now.</p>
        <div className="mt-8">
          <iframe
            src="https://giphy.com/embed/T1WqKkLY753dZghbu6"
            width="480"
            height="398"
            frameBorder="0"
            className="giphy-embed block mx-auto"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    );
}