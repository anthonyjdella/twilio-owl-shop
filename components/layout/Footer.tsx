import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="text-2xl">🦉</div>
                            <span className="text-xl font-bold">Owl Shop</span>
                        </div>
                        <p className="text-gray-300 mb-4 max-w-md">
                            Premium clothing and accessories for the modern
                            professional. Elevate your style with our carefully
                            curated collection of high-quality pieces.
                        </p>
                        <div className="flex space-x-4">
                            <a
                                href="#"
                                className="text-gray-300 hover:text-white"
                            >
                                <span className="sr-only">Facebook</span>
                                <svg
                                    className="h-6 w-6"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                                </svg>
                            </a>
                            <a
                                href="#"
                                className="text-gray-300 hover:text-white"
                            >
                                <span className="sr-only">Instagram</span>
                                <svg
                                    className="h-6 w-6"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987c6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.328-1.297L1.435 17.69l1.999-3.686c-.874-.954-1.411-2.224-1.411-3.611c0-2.934 2.383-5.317 5.317-5.317c1.411 0 2.691.55 3.631 1.435l-1.279 1.279c-.671-.671-1.595-1.087-2.612-1.087c-2.05 0-3.707 1.657-3.707 3.707c0 .824.268 1.585.733 2.202l1.297-2.386c.412-.757 1.207-1.279 2.127-1.279c1.338 0 2.424 1.087 2.424 2.424c0 .92-.522 1.715-1.279 2.127l-2.386 1.297c.617.465 1.378.733 2.202.733c2.05 0 3.707-1.657 3.707-3.707c0-1.017-.416-1.941-1.087-2.612l1.279-1.279c.885.94 1.435 2.22 1.435 3.631c0 2.934-2.383 5.317-5.317 5.317z" />
                                </svg>
                            </a>
                            <a
                                href="#"
                                className="text-gray-300 hover:text-white"
                            >
                                <span className="sr-only">Twitter</span>
                                <svg
                                    className="h-6 w-6"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Shop</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    href="/products"
                                    className="text-gray-300 hover:text-white"
                                >
                                    All Products
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/products?category=Jackets"
                                    className="text-gray-300 hover:text-white"
                                >
                                    Jackets
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/products?category=Tops"
                                    className="text-gray-300 hover:text-white"
                                >
                                    Tops
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/products?category=Dresses"
                                    className="text-gray-300 hover:text-white"
                                >
                                    Dresses
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/products?featured=true"
                                    className="text-gray-300 hover:text-white"
                                >
                                    Featured Items
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">
                            Customer Care
                        </h3>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    href="/contact"
                                    className="text-gray-300 hover:text-white"
                                >
                                    Contact Us
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/shipping"
                                    className="text-gray-300 hover:text-white"
                                >
                                    Shipping Info
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/returns"
                                    className="text-gray-300 hover:text-white"
                                >
                                    Returns
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/size-guide"
                                    className="text-gray-300 hover:text-white"
                                >
                                    Size Guide
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/faq"
                                    className="text-gray-300 hover:text-white"
                                >
                                    FAQ
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Newsletter Signup */}
                <div className="border-t border-gray-700 mt-8 pt-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div className="mb-4 md:mb-0">
                            <h3 className="text-lg font-semibold mb-2">
                                Stay Updated
                            </h3>
                            <p className="text-gray-300">
                                Subscribe to receive exclusive offers and style
                                updates.
                            </p>
                        </div>
                        <div className="flex w-full md:w-auto">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 md:w-64 px-4 py-2 bg-gray-800 border border-gray-600 rounded-l-lg focus:ring-2 focus:ring-white focus:border-transparent text-white"
                            />
                            <button className="px-6 py-2 bg-white text-gray-900 font-medium rounded-r-lg hover:bg-gray-100 transition duration-200">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom */}
                <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row md:items-center md:justify-between">
                    <p className="text-gray-300 text-sm">
                        © 2025 Owl Shop. All rights reserved.
                    </p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <Link
                            href="/privacy"
                            className="text-gray-300 hover:text-white text-sm"
                        >
                            Privacy Policy
                        </Link>
                        <Link
                            href="/terms"
                            className="text-gray-300 hover:text-white text-sm"
                        >
                            Terms of Service
                        </Link>
                        <Link
                            href="/accessibility"
                            className="text-gray-300 hover:text-white text-sm"
                        >
                            Accessibility
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
