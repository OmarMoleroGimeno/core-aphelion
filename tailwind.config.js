/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                // Custom premium colors if needed, extending default palette
                primary: 'var(--p-primary-color)', // Sync with PrimeVue if needed
            }
        },
    },
    plugins: [],
}
