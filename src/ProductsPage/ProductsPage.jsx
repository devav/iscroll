import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import InfiniteScroll from 'react-infinite-scroller';
import qwest from 'qwest';

const imageList = [];
const api = {
    baseUrl: 'https://api.soundcloud.com',
    client_id: 'caf73ef1e709f839664ab82bef40fa96'
};
class ProductsPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            user: {
                firstName: '',
                lastName: '',
                username: '',
                password: ''
            },
            tracks: [],
              hasMoreItems: true,
              nextHref: null,
            submitted: false
        };
    }

    loadItems(page) {
        var self = this;

        var url = api.baseUrl + '/users/8665091/favorites';
        if(this.state && this.state.nextHref) {
            url = this.state.nextHref;
        }

        qwest.get(url, {
                client_id: api.client_id,
                linked_partitioning: 1,
                page_size: 10
            }, {
                cache: true
            })
            .then(function(xhr, resp) {
                if(resp) {
                    var tracks = self.state.tracks;
                    resp.collection.map((track) => {
                        if(track.artwork_url == null) {
                            track.artwork_url = track.user.avatar_url;
                        }

                        tracks.push(track);
                    });

                    if(resp.next_href) {
                        self.setState({
                            tracks: tracks,
                            nextHref: resp.next_href
                        });
                    } else {
                        self.setState({
                            hasMoreItems: false
                        });
                    }
                }
            });
    }

    render() {
        const { registering  } = this.props;
        const { user, submitted } = this.state;
        const loader = <div className="loader">Loading ...</div>;
          var items = [];
          this.state.tracks.map((track, i) => {
            items.push(
                <div className="track" key={i}>
                    <a href={track.permalink_url} target="_blank">
                        <img src={track.artwork_url} width="150" height="150" />
                        <p className="title">{track.title}</p>
                    </a>
                </div>
            );
        });
        return (

            <InfiniteScroll
                          pageStart={0}
                          loadMore={this.loadItems.bind(this)}
                          hasMore={this.state.hasMoreItems}
                          loader={loader}>

                          <div className="tracks">
                              {items}
                          </div>
                      </InfiniteScroll>

        );
    }
}

function mapStateToProps(state) {
    const { registering } = state.registration;
    return {
        registering
    };
}

const connectedProductsPage = connect(mapStateToProps)(ProductsPage);
export { connectedProductsPage as ProductsPage };
