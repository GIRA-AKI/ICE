const session = null

export default function Page() {
    if(!session) throw new Error ('Auth is required to access this resource')

    return <main>This an auth-only page</main>
}