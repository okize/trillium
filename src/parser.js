
const getBeerImageUrl = ($el) => {
  const image = $el.find('.summary-thumbnail-image');
  const imageUrl = image.data('src');

  if (!image.length || !imageUrl) { return null; }
  return imageUrl;
};

const getBeerCanPrice = ($el) => {
  const description = $el.find('.summary-metadata-item').text();

  const re = /(\$.*) (per|for) 4-pack/i;
  const hasCans = description.match(re);

  if (hasCans) {
    return hasCans[1];
  }
  return null;
};

module.exports = {
  getBeerImageUrl,
  getBeerCanPrice,
};
