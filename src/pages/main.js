/* eslint-disable prettier/prettier */
import React, {useState, useReducer, useEffect, useCallback} from 'react';
import api from '../services/api';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from 'react-navigation-hooks';

function ListCard({url, title, description}) {
  const {navigate} = useNavigation();

  function onPress() {
    navigate('Product', {url, title});
  }

  return (
    <View style={styles.productContainer}>
      <Text style={styles.productTitlte}>{title}</Text>
      <Text style={styles.productionDescription}>{description}</Text>
      <TouchableOpacity style={styles.productButton} onPress={onPress}>
        <Text style={styles.productButtonText}>Acessar</Text>
      </TouchableOpacity>
    </View>
  );
}

const INITIAL_REDUCER_STATE = {
  loading: false,
  productionInfo: {},
  docs: [],
  page: 0,
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: !state.loading,
      };

    case 'INSERT_PAGE':
      const {docs, productionInfo} = action.payload;

      return {
        ...state,
        productionInfo,
        docs: [...state.docs, ...docs],
        page: state.page + 1,
      };

    default:
      return state;
  }
}

export default function Main(props) {
  /**
   *
   * Equivalente a `state`
   */

  //   const [state, setState] = useState(
  //     /* initial state */ {
  //       loading: false,
  //       productionInfo: {},
  //       docs: [],
  //       page: 1,
  //     },
  //   );

  /**
   *
   * Alternativa a useState quando trata-se de fluxos de dados/processos mais pesados
   *
   * Listagens por ex.
   */
  const [data, dispatch] = useReducer(reducer, INITIAL_REDUCER_STATE);

  const loadProducts = useCallback(
    async function(page = 1) {
      //  setState(prevState => ({
      //      ...prevState,
      //      loading: !prevState.loading
      //  }))
      dispatch({type: 'SET_LOADING'});
      try {
        const response = await api.get(`/products?page=${page}`);

        const {docs, ...productionInfo} = response.data;

        //  setState(prevState => ({
        //      ...prevState,
        //      productionInfo,
        //      docs: [...prevState.docs, docs]
        //  }))

        dispatch({
          type: 'INSERT_PAGE',
          payload: {docs, productionInfo},
        });
      } catch (err) {
        console.log(err);
      } finally {
        //  setState(prevState => ({
        //      ...prevState,
        //      loading: !prevState.loading
        //  }))
        dispatch({type: 'SET_LOADING'});
      }
    },
    [dispatch /* setState */],
  );

  useEffect(
    () => {
      loadProducts();
    },
    // os Effects devem ter dentro das suas depedências todas variáveis que fazem parte do efeito colateral
    [loadProducts],
  );

  function loadMore() {
    const {page, productionInfo, loading} = data;
    if (data.docs.length && page < productionInfo.pages && !loading) {
      loadProducts(page + 1);
    }
  }

  function renderListFooter() {
    if (data.loading) {
      return <ActivityIndicator size="large" color="#DA552F" />;
    }

    return null;
  }

  function renderItem({item}) {
    return <ListCard {...item} />;
  }

  return (
    <FlatList
      contentContainerStyle={styles.list}
      data={data.docs /* state.docs */}
      keyExtractor={item => item._id}
      renderItem={renderItem}
      onEndReached={loadMore}
      onEndReachedThreshold={0.1}
      ListFooterComponent={renderListFooter}
      listFooterContainerStyle={styles.listFooterContainerStyle}
    />
  );
}

Main.navigationOptions = {
  title: 'JSHunt',
};

// export default class Main extends Component {
//     static navigationOptions = {
//         title: "JSHunt"
//     };

//     state = {
//         productionInfo: {},
//         docs: [],
//         page: 1,
//     }

//     componentDidMount() {
//         this.loadProducts();
//     }

//     loadProducts = async (page = 1) => {
//         try {
//             const response = await api.get(`/products?page=${page}`);
//             const { docs, ...productionInfo } = response.data;
//             this.setState({
//                 docs: [...this.state.docs, ...docs],
//                 productionInfo,
//                 page,
//             });
//         } catch (err) {
//             console.log(err);
//             // throw new Error(`Err: ${err}`)
//         }
//     }

//     renderItem = ({ item }) => (
//         <View style={styles.productContainer}>
//             <Text style={styles.productTitlte}>{item.title}</Text>
//             <Text style={styles.productionDescription}>{item.description}</Text>
//             <TouchableOpacity
//                 style={styles.productButton}
//                 onPress={() => {
//                     this.props.navigation.navigate('Product', { product: item });
//                 }} >
//                 <Text style={styles.productButtonText}> Acessar </Text>
//             </TouchableOpacity>
//         </View>
//     )

//     loadMore = () => {
//         const { page, productionInfo } = this.state;
//         if (page === productionInfo.pages) return;
//         this.loadProducts(page + 1);
//     }

//     render() {
//         return (
//             <View style={styles.container}>
//                 <FlatList
//                     contentContainerStyle={styles.list}
//                     data={this.state.docs}
//                     keyExtractor={item => item._id}
//                     renderItem={this.renderItem}
//                     onEndReached={this.loadMore}
//                     onEndReachedThreshold={0.1}
//                 />
//             </View>
//         );
//     }
// }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  list: {
    padding: 20,
  },
  productContainer: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 5,
    padding: 20,
    marginBottom: 20,
  },
  productTitlte: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },

  productionDescription: {
    fontSize: 16,
    color: '#999',
    marginTop: 5,
    lineHeight: 24,
  },

  productButton: {
    height: 42,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#DA552F',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },

  productButtonText: {
    fontSize: 16,
    color: '#DA552F',
    fontWeight: 'bold',
  },

  listFooterContainerStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 16,
  },
});
