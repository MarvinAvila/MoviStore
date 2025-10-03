import React from 'react';
import { View, StyleSheet } from 'react-native';

const ProductCardSkeleton = () => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* Placeholder para la imagen */}
        <View style={styles.imageSkeleton} />
        <View style={styles.content}>
          {/* Placeholder para el nombre del producto */}
          <View style={styles.textSkeleton} />
          {/* Placeholder para la descripción */}
          <View style={[styles.textSkeleton, styles.shortText]} />
          <View style={styles.footer}>
            {/* Placeholder para el precio */}
            <View style={styles.priceSkeleton} />
            {/* Placeholder para el botón del carrito */}
            <View style={styles.buttonSkeleton} />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 8,
    flex: 1,
    maxWidth: '50%',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'hidden',
  },
  imageSkeleton: {
    width: '100%',
    height: 150,
    backgroundColor: '#E5E5E5',
  },
  content: {
    padding: 12,
  },
  textSkeleton: {
    height: 16,
    backgroundColor: '#E5E5E5',
    borderRadius: 4,
    marginBottom: 8,
  },
  shortText: {
    width: '80%',
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceSkeleton: {
    width: 60,
    height: 20,
    backgroundColor: '#E5E5E5',
    borderRadius: 4,
  },
  buttonSkeleton: {
    width: 36,
    height: 36,
    backgroundColor: '#E5E5E5',
    borderRadius: 18,
  },
});

export default ProductCardSkeleton;