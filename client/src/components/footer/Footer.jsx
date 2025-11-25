export default function Footer() {
  return (
    <footer className="border-t-3 bg-gray-100 text-center text-gray-800 py-6">
        <div className="mx-auto max-w-screen-lg">
            <h5 className="mb-2 font-semibold flex justify-center items-center gap-2 text-lg">
                <i className="bi bi-book-half text-blue-600 text-xl"></i>
                Online Library
            </h5>

            <h6 className="mb-2 text-sm">
                &copy; {new Date().getFullYear()} All Rights Reserved.
            </h6>

            <h6 className="mb-0 text-sm flex justify-center items-center gap-1">
                Designed and developed by
                <a
                    href="https://github.com/kontakta39"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-blue-600 hover:text-inherit transition flex items-center gap-1"
                >
                    <i className="bi bi-github text-lg"></i>
                    Ivan Angelov
                </a>
            </h6>
        </div>
    </footer>
  );
}