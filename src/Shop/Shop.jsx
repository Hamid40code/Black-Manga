import Card from "./Card";
import ScuroImg from "./scuro.img/scuro_1_2.jpg"
function Shop() {
    return (
        <>
        //<Navbar />
            <div>
                <h1>🌟New🌟</h1>
                <Card img={ScuroImg} name="Scuro" chapter="3"/>
                <Card img={ScuroImg} name="Scuro" chapter="3"/>
                <Card img={ScuroImg} name="Scuro" chapter="3"/>
            </div>
        </>
    );
}

export default Shop