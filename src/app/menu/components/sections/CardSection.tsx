import Card from "../ui/Card";

export default function CardSection() {
    return (
        <section className="grid grid-cols-2 gap-4 place-items-center max-w-4xl mx-auto px-2 text-balance">
            <Card title="Sesión 1" description="Sesión para decidir qué hacemos con este proyecto" />
            <Card title="Sesión 2" description="Sesión para decidir qué hacemos con este proyecto" />
            <Card title="Sesión 3" description="Sesión para decidir qué hacemos con este proyecto" />
            <Card title="Sesión 4" description="Sesión para decidir qué hacemos con este proyecto" />
        </section>
    )
}