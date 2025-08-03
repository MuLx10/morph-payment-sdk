// @ts-check
 
export default (phase, { defaultConfig }) => {
    /**
     * @type {import('next').NextConfig}
     */
    const nextConfig = {
      distDir: 'dist', // Or 'build' or your desired folder name
      output: 'export', // This enables static HTML export

      /* config options here */
    }
    return nextConfig
  }