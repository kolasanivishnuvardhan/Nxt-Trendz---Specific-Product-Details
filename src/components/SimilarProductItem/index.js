import './index.css'

const SimilarProductItem = props => {
  const {productData} = props
  const { title, imageUrl, brand, price, rating} = productData
  return (
    <li className="similar-product-item">
      <img
        src={imageUrl}
        alt={`similar product ${title}`}
        className="similar-img"
      />
      <h1 className="similar-product-title">{title}</h1>
      <p className="brand">by {brand}</p>
      <div className="similar-product-price-rating-container">
        <p className="similar-product-price">Rs {price}/-</p>
        <p className="similar-product-rating">
          {rating}
          <span>
            <img
              src="https://assets.ccbp.in/frontend/react-js/star-img.png"
              alt="star"
              className="similar-product-star"
            />
          </span>
        </p>
      </div>
    </li>
  )
}

export default SimilarProductItem
