import React, {useState} from 'react';
import {SafeAreaView, View} from 'react-native';
import {
  MapView,
  Camera,
  CircleLayer,
  ShapeSource,
  Logger,
} from '@rnmapbox/maps';
import {Text, Divider} from 'react-native-elements';

import Page from '../common/Page';
import colors from '../../styles/colors';

Logger.setLogLevel('verbose');

const styles = {
  map: {
    flex: 1,
  },
  info: {
    flex: 0,
    padding: 10,
  },
  divider: {
    marginVertical: 10,
  },
  fadedText: {
    color: 'gray',
  },
};

const MapGestureHandlers = props => {
  const [lastCallback, setLastCallback] = useState('');
  const [region, setRegion] = useState({});
  const [features, setFeatures] = useState([]);

  const properties = region?.properties;

  const buildShape = feature => {
    return {
      type: 'Point',
      coordinates: feature.geometry.coordinates,
    };
  };

  const addFeature = (feature, kind) => {
    const _feature = {...feature};
    _feature.properties.kind = kind;
    setFeatures(prev => [...prev, _feature]);
  };

  return (
    <Page {...props}>
      <MapView
        style={styles.map}
        onPress={_feature => {
          addFeature(_feature, 'press');
        }}
        onLongPress={_feature => {
          addFeature(_feature, 'longPress');
        }}
        onCameraChanged={_region => {
          setLastCallback('onCameraChanged');
          setRegion(_region);
        }}
        onMapIdle={_region => {
          setLastCallback('onMapIdle');
          setRegion(_region);
        }}>
        <Camera
          centerCoordinate={[-73.984638, 40.759211]}
          zoomLevel={12}
          animationDuration={0}
        />
        {features.map((f, i) => {
          const id = JSON.stringify(f.geometry.coordinates);
          const circleStyle =
            f.properties.kind === 'press'
              ? {
                  circleColor: colors.primary.blue,
                  circleRadius: 6,
                }
              : {
                  circleColor: colors.primary.pink,
                  circleRadius: 12,
                };
          return (
            <ShapeSource key={id} id={`source-${id}`} shape={buildShape(f)}>
              <CircleLayer id={`layer-${id}`} style={circleStyle} />
            </ShapeSource>
          );
        })}
      </MapView>

      <SafeAreaView>
        <View style={styles.info}>
          <Text style={styles.fadedText}>
            Tap or long-press to create a marker.
          </Text>

          <Divider style={styles.divider} />

          <Text style={styles.fadedText}>lastCallback</Text>
          <Text>{lastCallback}</Text>

          <Divider style={styles.divider} />

          <Text style={styles.fadedText}>isUserInteraction</Text>
          <Text>{properties?.isUserInteraction ? 'Yes' : 'No'}</Text>

          <Divider style={styles.divider} />

          <Text style={styles.fadedText}>isAnimatingFromUserInteraction</Text>
          <Text>
            {properties?.isAnimatingFromUserInteraction ? 'Yes' : 'No'}
          </Text>
        </View>
      </SafeAreaView>
    </Page>
  );
};

export default MapGestureHandlers;
