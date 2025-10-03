import hat from '/chef_hat.png'

export default function Header() {
    return (
    <header>
        <nav className="nav-header">
            <img src={hat} alt="Chef hat logo" className="logo" />
            <h1>Chef's Menus</h1>
        </nav>
    </header>
    ) 
}