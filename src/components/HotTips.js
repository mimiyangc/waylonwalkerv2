import React, { Component } from 'react'
import styled from 'styled-components'
import Tip from '../components/Tip'
import FlipMove from 'react-flip-move'
import Fuse from 'fuse.js'

const HotTipsStyle = styled.div`
  display: flex;
  margin: auto;
  flex-direction: column;
  justify-content: flex-start;

  align-items: center;
  align-content: center;
  justify-self: center;
  min-height: 100vh;
  width: calc(min(1800px, 90vw));

  input {
    margin-left: 1rem;
  }

  img {
    margin: auto;
  }

  .post-cards {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }

  .post-wrapper: {
    display: inline-flex;
  }

  .robots {
    display: None;
    opacity: 0;
    visibility: hidden;
  }
`

class HotTips extends Component {
  constructor(props) {
    super(props)
    this.state = {
      posts: props.posts,
      filteredPosts: props.posts,
      search: '',
      numPosts: 3,
      incrementBy: 9,
      incrementOffset: 2000,
    }
  }

  componentDidMount = async () => {
    window.addEventListener('scroll', this.handleScroll)
  }

  incrementMaxEntries = () => {
    this.setState({ numPosts: this.state.numPosts + this.state.incrementBy })
  }
  handleScroll = () => {
    const windowHeight =
      'innerHeight' in window
        ? window.innerHeight
        : document.documentElement.offsetHeight
    const body = document.body
    const html = document.documentElement
    const docHeight =
      Math.max(
        body.scrollHeight,
        body.offsetHeight,
        html.clientHeight,
        html.scrollHeight,
        html.offsetHeight
      ) - this.state.incrementOffset
    const windowBottom = windowHeight + window.pageYOffset
    if (windowBottom >= docHeight) {
      this.incrementMaxEntries()
    }
  }

  setSearch = (search) => this.setState({ search }, () => this.SearchWithFuse())

  SearchWithFuse = () => {
    const fuse = new Fuse(this.state.posts, { keys: ['node.html'] })
    if (this.state.search === '') {
      this.setState({ filteredPosts: this.state.posts })
    } else {
      this.setState({
        filteredPosts: fuse.search(this.state.search).map((i) => i.item),
      })
    }
  }

  render() {
    return (
      <HotTipsStyle>
        <form action="">
          <label htmlFor="search">
            Search:
            <input
              aria-label="Search"
              type="text"
              name="search"
              value={this.state.search}
              id="search"
              onChange={(e) => this.setSearch(e.target.value)}
            />
          </label>
        </form>
        <FlipMove className="post-cards">
          {this.state.filteredPosts
            .slice(0, this.state.numPosts)
            .map((post, i) => {
              return (
                <div
                  key={post.node.id}
                  className="post-wrapper"
                  style={{ display: 'inline-flex' }}
                >
                  <Tip
                    key={post.node.id}
                    frontmatter={post.node.frontmatter}
                    html={post.node.html}
                    content={post.node.plainText}
                    fileAbsolutePath={post.node.fileAbsolutePath}
                  />
                </div>
              )
            })}
          {/* < div className="robots">
            {this.state.posts.map((post, i) => <li><h3 id={`${post.node.frontmatter.title}-robot`}>{post.node.frontmatter.title}</h3><div className="description">{post.node.frontmatter.description}</div><a href={post.node['fields']['slug']} title={post.node.frontmatter.title}>{post.node.frontmatter.title}</a></li>)}
          </div> */}
        </FlipMove>
      </HotTipsStyle>
    )
  }
}
export default HotTips
