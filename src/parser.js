
const getBeerImageUrl = ($el) => {
  const image = $el.find('.summary-thumbnail-image');
  const imageUrl = image.data('src');

  if (!image.length || !imageUrl) { return null };
  return imageUrl;
};

module.exports = {
  getBeerImageUrl,
};
