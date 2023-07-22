import React from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { Container } from 'reactstrap';
import actions from '../../actions';
import Button from '../../components/Common/Button';
import { CloseIcon } from '../../components/Common/Icon';

class NavigationMenu extends React.Component {
  handleCategoryClick = (link, size) => {
    this.props.toggleMenu();
    this.props.fetchProductsBySize(link.name, size.name);
  };

  render() {
    // Destructure the props
    const { isMenuOpen, categories, toggleMenu, sizes, products } = this.props;

    return (
      <div className='navigation-menu'>
        <div className='menu-header'>
          {isMenuOpen && (
            <Button
              borderless
              variant='empty'
              ariaLabel='close the menu'
              icon={<CloseIcon />}
              onClick={toggleMenu}
            />
          )}
        </div>
        <div className='menu-body'>
          <Container>
            <h3 className='menu-title'>Shop By Category</h3>
            <nav role='navigation'>
              <ul className='menu-list'>
                {categories.map((link, index) => (
                  <li key={index} className='menu-item'>
                    <span>{link.name}</span>
                    <ul className='sizes-dropdown'>
                      {sizes.map((size, sizeIndex) => (
                        <li key={sizeIndex}>
                         
                          <NavLink
                      onClick={() => this.handleCategoryClick(link, size)}
                      to={'/shop/'+link.name+'/'+size.name}
                      activeClassName='active-link'
                      exact
                    >
                       {size.name}
                    </NavLink>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </nav>
          </Container>
        </div>

        {/* Display the products */}
        <div>
          {products.map((product, index) => (
            <div key={index}>{/* Render the product details */}</div>
          ))}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    sizes: state.size.storesizes,
    isMenuOpen: state.navigation.isMenuOpen,
    categories: state.category.storeCategories,
    products: state.product.products, // Retrieve the products from the Redux store
    error: state.product.error // Retrieve the error from the Redux store
  };
};

export default connect(mapStateToProps, actions)(NavigationMenu);
