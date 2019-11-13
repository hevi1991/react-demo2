import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import data from "./data.js";

/// 每一行展示一个产品
class ProductRow extends React.Component {
  render() {
    return (
      <li className="product-row">
        <span className={`name ${!this.props.product.stocked && "red"}`}>
          {this.props.product.name}
        </span>
        <span className="price">{this.props.product.price}</span>
      </li>
    );
  }
}

/// 为每一个产品类别展示标题
class ProductCategoryRow extends React.Component {
  render() {
    return (
      <div>
        <b>{this.props.value}</b>
      </div>
    );
  }
}

/// 展示数据内容并根据用户输入筛选结果
class ProductTable extends React.Component {
  renderRows() {
    const categories = Array.from(
      new Set(this.props.products.map(p => p.category))
    );
    return categories.map(category => {
      const rows = this.props.products
        .filter(p => p.category === category)
        .map(p => <ProductRow product={p} key={p.name} />);
      return (
        <ul key={category}>
          <ProductCategoryRow value={category} />
          {rows}
        </ul>
      );
    });
  }
  render() {
    return (
      <div>
        <div className="product-table-header">
          <b className="name">Name</b>
          <b className="price">Price</b>
        </div>
        {this.renderRows()}
      </div>
    );
  }
}

/// 接受所有的用户输入
class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: null,
      inStock: false
    };
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
    this.props.onChange(Object.assign({}, this.state, { [name]: value }));
  }

  render() {
    return (
      <div className="search-bar">
        <input
          type="text"
          className="search-bar-input"
          placeholder="Search..."
          name="name"
          onChange={this.handleInputChange}
        />
        <br />
        <input
          type="checkbox"
          name="inStock"
          onChange={this.handleInputChange}
        />
        Only show products in stock
      </div>
    );
  }
}

/// 整个示例应用的整体
class FilterableProductTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    };

    this.computedData = this.computedData.bind(this);
  }

  componentDidMount() {
    this.setState({ data: data });
  }

  computedData(form) {
    let filteData = data.slice();
    filteData = filteData.filter(d => d.name.includes(form.name));
    if (form.inStock) {
      filteData = filteData.filter(d => d.stocked === true);
    }
    this.setState({ data: filteData });
  }

  render() {
    return (
      <div className="filterable-product-table">
        <SearchBar onChange={this.computedData} />
        <ProductTable products={this.state.data} />
      </div>
    );
  }
}

ReactDOM.render(<FilterableProductTable />, document.getElementById("root"));
