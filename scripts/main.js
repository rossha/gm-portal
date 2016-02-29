var React = require('react');
var ReactDOM = require('react-dom');

var ReactRouter = require('react-router');
var Router  = ReactRouter.Router;
var Route = ReactRouter.Route;
var History = ReactRouter.History;
var createBrowserHistory = require('history/lib/createBrowserHistory');

var h = require('./helpers');

// Firebase
var Rebase = require('re-base');
var base = Rebase.createClass('https://dazzling-heat-2731.firebaseio.com/');

/*
  App
*/

var App = React.createClass({
  getInitialState : function() {
    return {
      items : {},
      images : [],
      articles : [],
      keywords: [],
      regions : [],
      types : [],
      topics : {},
      selectedKeywords : [],
      filterText : '',
      topic : {},
      region : "",
      type : "",
      image : {}
    }
  },
  componentDidMount : function () {
    base.syncState('Articles', {
      context: this,
      state: 'items',
      then() {
        var regions = this.state.regions;
        var images = this.state.images;
        var articles = this.state.articles;
        this.state.items.map(function(item) {
          if(item.type == "image") {
            images.push(item);
          } else {
            articles.push(item);
          }
        });
      }
    });
    base.syncState('Featured/topics', {
      context: this,
      state: 'topics',
      then() {
        //console.log(this.state.topics);
      }
    });
    base.syncState('Regions', {
      context: this,
      state: 'regions'
    });
    base.syncState('Keywords', {
      context: this,
      state: 'keywords'
    });
  },
  handleUserInput : function(filterText) {
    this.setState({
      filterText: filterText
    });
  },
  handleRegionDropdown : function(region) {
    this.setState({
      region: region
    });
  },
  handleTypeDropdown : function(type) {
    this.setState({
      type: type
    });
  },
  handleTopicSelection : function(topic) {
    this.setState({
      topic: topic
    });
  },
  handleImageSelection : function(image) {
    this.setState({
      image: image
    });
  },
  handleUpdateKeywords : function(k) {
    var list = this.state.selectedKeywords;
    var keyword = list.indexOf(k);
    if(keyword > -1) {
      list.splice(keyword,1);
    } else {
      list.push(k);
    }
    this.setState({
      selectedKeywords: list
    });
  },
  handleClearImage : function() {
    this.setState({
      image:{}
    })
  },
  handleShowAll : function() {
    this.setState({
      filterText:'',
      topic:{},
      region:"",
      image:{}
    });
  },
  render : function() {
    return (
      <div className="gm-web-portal">
        <div className="menu-container">
          <Header tagline="Academic Materials and Scholarly Research Pertaining to Genetic Modification"/>
          <Topics
            topics={this.state.topics}
            topic={this.state.topic}
            filterText={this.state.filterText}
            onUserClick={this.handleTopicSelection} />
          <SearchContainer
            region={this.state.region}
            regions={this.state.regions}
            keywords={this.state.keywords}
            showAll={this.handleShowAll}
            filterText={this.state.filterText}
            onUserInput={this.handleUserInput}
            typeDropdown={this.handleTypeDropdown}
            updateKeywords={this.handleUpdateKeywords}
            regionDropdown={this.handleRegionDropdown} />
          <Items
            topic={this.state.topic}
            region={this.state.region}
            image={this.state.image}
            images={this.state.images}
            articles={this.state.articles}
            selectedKeywords={this.state.selectedKeywords}
            imageSelected={this.handleImageSelection}
            filterText={this.state.filterText}
            clearImage={this.handleClearImage} />
        </div>  
      </div>
    )
  }
});

/*
  Header
  <Header/>
*/

var Header = React.createClass({
  render : function() {
    return (
      <header className="top">
        <h1>GM Web Portal</h1>
        <h3 className="tagline"><span>{this.props.tagline}</span></h3> 
      </header>
    )
  }
})

/*
  Topics
  <Topics/>
*/

var Topics = React.createClass({
  render : function() {
    var topics = this.props.topics;
    var selectedTopic = this.props.topic;
    var handleTopicSelection = this.props.onUserClick;
    var topicBoxes = [];
    var topicDesc;
//<TopicDesc topic={topics} />

    (function changeTopic() {
      topicDesc = <TopicDesc topic={selectedTopic} />
    })()

    Object.keys(topics).map(function(key) {
      var thisTopic = topics[key];
      var thisKey = key;
      topicBoxes.push(<TopicBox key={thisKey} index={thisKey} details={thisTopic} onUserClick={handleTopicSelection} />);
    });
    return (
      <div className="topic-container">
        <div className="topic-box-container">
          {topicBoxes}
        </div>
        {topicDesc}
      </div>
    )
  }
})

/*
  Topic Box
  <TopicBox/>
*/ 

var TopicBox = React.createClass({
  handleChange: function() {
    this.props.onUserClick(
      this.props.details
    );
  },
  render : function() {
    var details = this.props.details;
    return (
      <div style={{background : "url(" + details.src + ") center no-repeat; background-size:100%"}} className="topic-box" onClick={this.handleChange}>
        <p>{details.topic}</p>
      </div>
    )
  }
})

/*
  Top Desc
  <TopDesc />
*/

var TopicDesc = React.createClass({
  // onButtonClick : function() {

  // },
  render : function() {
    return (
      <div className="topic-desc">
        <h3 className="topic-desc-title">{this.props.topic.topic}</h3>
        <p>{this.props.topic.desc}</p>
      </div>
    )
  }
})

/* 
  Search Container
  <SearchContainer />
 */

var SearchContainer = React.createClass({
  render : function() {
    return (
      <div className="search-container">
        <form className="search-form">
          <p>Search Resources</p>
          <div className="dropdown-container">
            <span>Search By Region: </span>
            <Dropdown 
              region={this.props.region}
              regionDropdown={this.props.regionDropdown}
              options={this.props.regions}
              nullText="Select Region..." />
          </div>
          <KeywordList updateKeywords={this.props.updateKeywords} keywords={this.props.keywords} />
          {/*<Dropdown 
            region={this.props.region}
            regionDropdown={this.props.regionDropdown}
            options={this.props.regions}
            nullText="Select Resource Type..." />*/}
          <SearchInput
            filterText={this.props.filterText}
            onUserInput={this.props.onUserInput} />
          <p className="search-show-all" onClick={this.props.showAll}>Clear Search Parameters</p> 
        </form>
      </div>
    )
  }
}) 

/*
  Dropdown
  <Dropdown />
*/
var Dropdown = React.createClass({
  handleChange: function(event) {
    this.props.regionDropdown(
      event.target.value
    );
  },
  render: function() {
    return (
      <select value={this.props.region} onChange={this.handleChange}>
        <option key="none" value="">{this.props.nullText}</option>
        {this.props.options.map(function(obj) {
          var thisObj = obj;
          return <DropdownOption details={thisObj} key={thisObj.keyword} />
        })}
      </select>
    )
  }
});

/*
  Dropdown Option
  <DropdownOption />
*/
var DropdownOption = React.createClass({
  render: function() {
    return (
      <option value={this.props.details.keyword}>{this.props.details.title}</option>
    )
  }
});

/*
  Keywords
  <Keywords />
*/
var KeywordList = React.createClass({
  render: function() {
    var updateKeywords = this.props.updateKeywords;
    return (
      <div className="keyword-container">
        <p>Search By Keywords</p>
        {this.props.keywords.map(function(obj) {
          var thisObj = obj;
          return <Keyword updateKeywords={updateKeywords} details={thisObj} key={thisObj.keyword} />
        })}
      </div>
    )
  }
});

/*
  Keyword
  <Keyword />
*/
var Keyword = React.createClass({
  handleClick: function(event) {
    if(event.target.className == "selected") {
      event.target.className = "";
      this.props.updateKeywords(
        this.props.details.keyword
      );
    } else {
      event.target.className = "selected";
      this.props.updateKeywords(
        this.props.details.keyword
      );
    }
    // this.props.(
    //   this.props.details
    // );
    // this.props.regionDropdown(
    //   event.target.value
    // );
  },
  render: function() {
    return (
      <span value={this.props.details.keyword} onClick={this.handleClick}>{this.props.details.title}</span>
    )
  }
});

/*
  Search Input
  <SearchInput />
*/

var SearchInput = React.createClass({
  handleChange: function() {
    this.props.onUserInput(
      this.refs.filterTextInput.value
    );
  },
  render: function() {
    return (
      <input
        className="search-input"
        type="text"
        placeholder="Search..."
        value={this.props.filterText}
        ref="filterTextInput"
        onChange={this.handleChange}/>
    );
  }
});

/*
  Items
  <Items />
*/
var Items = React.createClass({
  render: function() {
    var articleList = [];
    var imageList = [];
    var used_keys = [];
    var items = this.props.items;
    var images = this.props.images;
    var articles = this.props.articles;
    var topic = this.props.topic;
    var region = this.props.region;
    var filter = this.props.filterText.toLowerCase();
    var imageSelected = this.props.imageSelected;
    var selectedKeywords = this.props.selectedKeywords;
    filter = filter.split(" ");

    // selected

    var filtered = function(term) {
      for(var i=0;i<filter.length;i++){ 
        if(term.toLowerCase().indexOf(filter[i]) > -1){
          return false;
        } else {
          return true;
        }
      }
    }

    var inRegion = function(thisRegion) {
      if(region == undefined || region == "") {
        return true;
      } else if (region == thisRegion) {
          return true;
      } else {
        return false;
      }
    }

    var onTopic = function(keywords) {
      var onTopic;
      Object.keys(keywords).map(function(k) {
        if(Object.keys(topic).length == 0) {
          onTopic = true;
        } else if (keywords[k] == topic.key) {
          onTopic =  true;
        } else {
          onTopic;
        }
      })
      return onTopic;
    }

    var hasKeywords = function(obj) {
      var keywords = [];
      Object.keys(obj).map(function(k) {
        keywords.push(obj[k]);
      })
      if(selectedKeywords.length == 0) {
        return true;
      } else {
        var hasKeyword = true;
        selectedKeywords.map(function(k){
          if(keywords.indexOf(k) == -1){
            hasKeyword = false;
          }
        });
        return hasKeyword;
      }
    }

    var isType = function(type) {
      if(type == undefined || type == "") {
        return true;
      } else if (type == thisType) {
          return true;
      } else {
        return false;
      }
    }

    var filterItems = function(obj, key, type) {
      Object.keys(obj).map(function(k) {
        var term = obj[k];
        if(typeof term == 'object') {
          filterItems(term, key);
          return;
        } else if (typeof term == 'number') {
          return;
        } else if ( filtered(term) ) {
          return;
        } else {
          if(used_keys.indexOf(key) == -1 && key !== undefined) {
            used_keys.push(key);
            if(type == "article") {
              articleList.push(<Article key={key} index={key} details={articles[key]}/>);
            } else if(type == "image") {
              imageList.push(<Image key={key} index={key} imageSelected={imageSelected} details={images[key]}/>)
            }
            return;
          }
        }
      });
    };

    Object.keys(articles).map(function(key) {
      var thisItem = articles[key];
      if(inRegion(thisItem.region) && onTopic(thisItem.keywords) && hasKeywords(thisItem.keywords)){
        var thisKey = key;
        return filterItems(thisItem, thisKey, "article");
      } else {

        return;
      }
    });

    Object.keys(images).map(function(key) {
      var thisItem = images[key];
      if(inRegion(thisItem.region) && hasKeywords(thisItem.keywords) && onTopic(thisItem.keywords)){
        var thisKey = key;
        filterItems(thisItem, thisKey, "image");
        return;
      } else {
        return;
      }
    });

    return (
      <div className="items-container">
        <div>
          <SelectedImage clearImage={this.props.clearImage} image={this.props.image} />
          <ImageList images={imageList}/>
        </div>
        <ul>
          {articleList}
        </ul>
      </div>
    );
  }
})

/*
  Article
  <Article />
*/

var Article = React.createClass({
  openClose : function() {
    isOpen == false ? (isOpen = true) : (isOpen = false);
  },
  render : function() {
    var details = this.props.details;
    var hasPDF = (details.link !== "" ? true : false);
    var hasURL = (details.url !== "" ? true : false);
    var isOpen = false;
    return (
      <li className={"article " + details.type}>
        <span className="article-title"><a target="_blank" className={hasURL} href={details.url}>{details.title}</a></span>
        <span className={"article-title " + !hasURL}>{details.title}</span>
        <img className={"openClose " + isOpen} src="https://s3.amazonaws.com/gm-web-portal/close.png" onclick={this.toggleOpen} />
        
        <span className={"article-pdf " + hasPDF}><a target="_blank" href={details.link}>> View as PDF</a></span>
        <h4 className="menu-item-author">{details.author}</h4>
        <p>{details.description}</p>
      </li>
    )
  }
});

/* 
   SelectedImage
  <SelectedImage />
 */

var SelectedImage = React.createClass({
  handleClose : function() {
    this.props.clearImage();
  },
  render : function() {
    if(Object.keys(this.props.image).length !== 0) {
    return (
      <div className="selected-image">
        <img className="close" src="https://s3.amazonaws.com/gm-web-portal/close.png" onClick={this.handleClose} />
        <Image details={this.props.image} />
        <p>{this.props.image.description}</p>
      </div>
    ) } else {
      return (
        <div></div>
      )
    }
  }
})

/* 
   Image List
  <ImageList />
 */

var ImageList = React.createClass({
  render : function() {
    return (
      <div className="image-container">
        {this.props.images}
      </div>
    )
  }
})

/*
  Image
  <Image />
*/

var Image = React.createClass({
  handleClick : function(event) {
    if(event.target.className == "selected-image") {
      return;
    } else {
      this.props.imageSelected(
        this.props.details
      );
    }
  },
  render : function() {
    var details = this.props.details;
    return (
      <img alt={details.description} src={details.link} onClick={this.handleClick} />
    )
  }
});

/*
  Routes
*/

var routes = (
  <Router history={createBrowserHistory()}>
    <Route path="/*" component={App}/>
  </Router>
)

ReactDOM.render(routes, document.querySelector('#main'));