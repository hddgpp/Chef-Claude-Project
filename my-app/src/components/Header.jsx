import hat from '../../public/chef_hat.png'

export function Header() {
    return (
    <header>
        <nav className="nav-header ">
            <img src={hat} alt="logo" className="logo" />
            <h1>Chef's menus</h1>
        </nav>
    </header>
    ) 
}