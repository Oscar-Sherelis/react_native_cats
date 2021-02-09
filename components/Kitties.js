// import { Provider } from "react-redux";
import { createStore } from "redux";

import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Image,
  Text,
  Dimensions,
  TextInput,
  ScrollView,
  TouchableHighlight,
} from "react-native";
import { checkConnected } from "../checkConnection";
import ErrorScreen from "../screens/ErrorScreen";
import Loader from "./Loader";
export default function Kitties() {
  const store = createStore(() => ({
    kitties: [],
  }));
  const [connectStatus, setConnectStatus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [kitties, setKitties] = useState([]);

  // pagination data
  const [receivedImagesNumber, setImagesNumber] = useState(100);
  const [kittiesPerPage, setKittiesPerPage] = useState(30);
  const [currentPage, setCurrentPage] = useState(1);

  // data between views
  const [viewChanger, setViewChanger] = useState(true);
  const [imageLink, setImageLink] = useState("");
  const [catName, setCatName] = useState("");

  //checks internet connection
  checkConnected().then((res) => {
    setConnectStatus(res);
  });

  const fetchKitties = async () => {
    setLoading(true);

    const getRandomArbitrary = (min, max) => {
      return Math.floor(Math.random() * (max - min) + min);
    };

    let data = [];
    for (let i = 0; i < receivedImagesNumber; i++) {
      data.push(
        "http://placekitten.com/" +
          getRandomArbitrary(200, 1000) +
          "/" +
          getRandomArbitrary(200, 1000)
      );
    }

    // getting data with redux and passing to state
    store.getState().kitties = data;
    setKitties(store.getState().kitties);
    setLoading(false);
  };
  let nameArr = ["Steven", "George", "Garry", "Greenfield"];

  // getting window width
  const window = Dimensions.get("window");
  const [dimensions, setDimensions] = useState({ window});

    const onChange = ({ window }) => {
    setDimensions({ window });
  };
  useEffect(() => {
    fetchKitties();
    Dimensions.addEventListener("change", onChange);
    return () => {
      Dimensions.removeEventListener("change", onChange);
    };
  }, []);

  function changeReceivedImagesNumber(newNumberOfImg) {
    setImagesNumber(newNumberOfImg);
    fetchKitties();
  }
  function changeView(imgData, selectedCatName) {
    viewChanger ? setViewChanger(false) : setViewChanger(true);
    setCatName(selectedCatName);
    setImageLink(imgData);
  }

  class RenderKitties extends React.Component {
    constructor() {
      super();
      this.handleClick = this.handleClick.bind(this);
    }

    handleClick(value) {
      setCurrentPage(value);
    }

    render() {
      // Logic for displaying
      const indexOfLastKitty = currentPage * kittiesPerPage;
      const indexOfFirstKitty = indexOfLastKitty - kittiesPerPage;
      const indexOfFirstKitties = kitties.slice(
        indexOfFirstKitty,
        indexOfLastKitty
      );

      const renderKitties = indexOfFirstKitties.map((kitty, kittyKey) => {
        let randomCat = nameArr[Math.ceil(Math.random() * nameArr.length - 1)];
        // console.log(Dimensions.width);
        return (
          <View
            onPress={() => changeView(kitty, randomCat)}
            key={kittyKey}
            style={{ marginBottom: 25, width: dimensions.window.width - 40 }}
          >
            <TouchableHighlight onPress={() => changeView(kitty, randomCat)}>
              <Image
                style={{
                  resizeMode: "cover",
                  position: "relative",
                  height: 300,
                }}
                source={{ uri: kitty }}
              />
            </TouchableHighlight>
            <Text>{randomCat}</Text>
          </View>
        );
      });

      // Logic for displaying page numbers
      const pageNumbers = [];
      for (let i = 1; i <= Math.ceil(kitties.length / kittiesPerPage); i++) {
        pageNumbers.push(i);
      }

      const renderPageNumbers = pageNumbers.map((number) => {
        return (
          <Text
            style={{ marginRight: 20, fontSize: 24 }}
            key={number}
            id={number}
            onPress={() => {this.handleClick(number)}}
          >
            {number}
          </Text>
        );
      });
      return (
        <View
          style={{
            marginTop: 50,
          }}
        >
          {/* <View style={{flexDirection:"row", alignItems: "center", flex: 1, justifyContent: "center", marginBottom: 20}}>
            <Text>Number of received images </Text>
            <TextInput
              placeholder="Type number of received images"
              onChangeText={(text) => changeReceivedImagesNumber(text)}
              defaultValue={receivedImagesNumber.toString()}
            />
          </View> */}
          <View
            style={{ flex: 1, flexDirection: "row", justifyContent: "center" }}
          >
            <Text
              style={{
                padding: 20,
                backgroundColor: "#2196F3",
                color: "#fff",
                marginRight: 10,
              }}
              onPress={() => {
                setKittiesPerPage(30);
              }}
            >
              30
            </Text>
            <Text
              style={{
                padding: 20,
                backgroundColor: "#2196F3",
                color: "#fff",
                marginRight: 10,
              }}
              onPress={() => {
                setKittiesPerPage(50);
              }}
            >
              50
            </Text>
            <Text
              style={{
                padding: 20,
                backgroundColor: "#2196F3",
                color: "#fff",
              }}
              onPress={() => {
                setKittiesPerPage(100);
              }}
            >
              100
            </Text>
          </View>
          <View style={{}}>{renderKitties}</View>
          <View style={{ flexDirection: "row" }} id="page-numbers">
            {renderPageNumbers}
          </View>
        </View>
      );
    }
  }

  function KittyList() {
    return (
        <RenderKitties></RenderKitties>
    );
  }

  function KittyView() {
    return (
      <View style={{ marginTop: 50, width: dimensions.window.width - 40 }}>
        <View>
          <Text
            style={{ textAlign: "center" }}
            onPress={() => {
              changeView();
            }}
          >
            Back To list
          </Text>
          <TouchableHighlight>
            <Image
              style={{
                resizeMode: "cover",
                position: "relative",
                height: 300,
              }}
              source={{ uri: imageLink }}
            />
          </TouchableHighlight>
          <Text style={{ marginBottom: 20 }}>{catName}</Text>
          <Text>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nobis, quo
            fugit et sunt cupiditate enim, ducimus sint eius ex ipsam neque?
            Nihil molestiae placeat dolore debitis, aliquid iste reiciendis
            modi.
          </Text>
        </View>
      </View>
    );
  }

  return connectStatus ? (
    <ScrollView>
      {loading ? (
        <Loader></Loader>
      ) : viewChanger ? (
          <KittyList></KittyList>

      ) : (
        <KittyView></KittyView>
      )}
    </ScrollView>
  ) : (
    <ErrorScreen style={{flex: 1}}></ErrorScreen>
  );
}

const styles = StyleSheet.create({
  imagesContainer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: "center",
  },
  imageStyle: {
    resizeMode: "cover",
    position: "relative",
    height: 300
  },
  liStyle: {
    marginBottom: 20,
  },
  buttonStyle: {
    padding: 20,
  },
});
