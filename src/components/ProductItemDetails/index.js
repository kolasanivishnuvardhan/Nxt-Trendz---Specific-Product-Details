import Loader from 'react-loader-spinner'
import {BsDashSquare} from 'react-icons/bs'
import {BsPlusSquare} from 'react-icons/bs'
import {Component} from 'react'
import './index.css'
import Cookie from 'js-cookie'

import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'

const apiConstantVariables = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    productItemDetails: {
      similarProducts: [],
    },
    count: 1,
    apiStatus: apiConstantVariables.initial,
  }
  componentDidMount() {
    this.getProductItemDetails()
  }

  getProductItemDetails = async () => {
    this.setState({apiStatus: apiConstantVariables.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const token = Cookie.get('jwt_token')

    const url = `https://apis.ccbp.in/products/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: 'GET',
    }

    const response = await fetch(url, options)
    if (response.ok) {
      const data = await response.json()
      const modifiedData = {
        id: data.id,
        imageUrl: data.image_url,
        title: data.title,
        style: data.style,
        price: data.price,
        rating: data.rating,
        availability: data.availability,
        brand: data.brand,
        description: data.description,
        similarProducts: data.similar_products,
        totalReviews: data.total_reviews,
      }
      this.setState({
        productItemDetails: modifiedData,
        apiStatus: apiConstantVariables.success,
      })
    } else {
      this.setState({apiStatus: apiConstantVariables.failure})
    }
  }

  onClickDecrementBtn = () => {
    this.setState(prevCount => {
      if (prevCount.count < 2) {
        return {count: 1}
      } else {
        return {count: prevCount.count - 1}
      }
    })
  }

  onClickIncrementBtn = () => {
    this.setState(prevState => ({count: prevState.count + 1}))
  }

  renderProductDetails = () => {
    const {productItemDetails} = this.state
    const {
      imageUrl,
      title,
      price,
      rating,
      description,
      availability,
      brand,
      totalReviews,
    } = productItemDetails
    const {count} = this.state
    return (
      <div className="product-details-container">
        <img src={imageUrl} className="product-img" alt="product" />
        <div className="product-description-container">
          <h1 className="title">{title}</h1>
          <p className="price">Rs {price}/-</p>
          <div className="rating-reviews-container">
            <p className="rating">
              {rating}
              <img
                src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                alt="star"
                className="star-img"
              />
            </p>
            <p className="total-reviews">{totalReviews} Reviews</p>
          </div>
          <p className="description">{description}</p>
          <p className="available">Availabe:{availability}</p>
          <p className="available">Brand: {brand}</p>
          <hr className="seperator" />
          <div className="increment-decrement-container">
            <button
              className="decrement-button"
              onClick={this.onClickDecrementBtn}
              data-testid="minus"
              type="button"
            >
              <BsDashSquare />
            </button>
            <p>{count}</p>
            <button
              className="decrement-button"
              onClick={this.onClickIncrementBtn}
              data-testid="plus"
              type="button"
            >
              <BsPlusSquare />
            </button>
          </div>
          <button className="add-to-cart" type="button">ADD TO CART</button>
        </div>
      </div>
    )
  }

  renderSimilarProductItem = () => {
    const{productItemDetails} = this.state
    const {similarProducts} = productItemDetails
    const modifiedSimilarProducts = similarProducts.map(eachProduct => ({
      brand: eachProduct.brand,
      id: eachProduct.id,
      imageUrl: eachProduct.image_url,
      price: eachProduct.price,
      rating: eachProduct.rating,
      title: eachProduct.title,
    }))
    return (
      <div className="similar-products-container">
        <h1 className="similar-products">Similar Products</h1>
        <ul className="similar-products-item-container">
          {modifiedSimilarProducts.map(eachProduct => (
            <SimilarProductItem
              key={eachProduct.id}
              productData={eachProduct}
            />
          ))}
        </ul>
      </div>
    )
  }

  onSuccessApiCall = () => {
    return (
      <>
        <Header />
        {this.renderProductDetails()}
        {this.renderSimilarProductItem()}
      </>
    )
  }

  renderLoadingView = () => {
    return (
      <div data-testid="loader">
        <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
      </div>
    )
  }

  onClickContinueShopping = () => {
    const {history} = this.props
    history.replace('/products')
  }
  renderFailureView = () => {
    return (
      <div>
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
          alt="failure view"
        />
        <h1>Product Not Found</h1>
        <button onClick={this.onClickContinueShopping} type="button">
          Continue Shopping
        </button>
      </div>
    )
  }

  renderProductItemDetails = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case 'SUCCESS':
        return this.onSuccessApiCall()
      case 'FAILURE':
        return this.renderFailureView()
      case 'IN_PROGRESS':
        return this.renderLoadingView()
      default:
        return null
    }
  }
  render() {
    return (
      <div className="product-item-details-container">
        {this.renderProductItemDetails()}
      </div>
    )
  }
}

export default ProductItemDetails
