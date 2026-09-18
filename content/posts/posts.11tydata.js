const { shouldHideInProduction } = require("../../lib/post-visibility");
const { resolveMediaUrl } = require("../../lib/resolve-media");

module.exports = {
  eleventyComputed: {
    featured_image(data) {
      return resolveMediaUrl(data.featured_image, { slug: data.slug });
    },
    permalink(data) {
      if (shouldHideInProduction({ date: data.date, draft: data.draft })) {
        return false;
      }
      const raw = data.slug || data.title || "";
      const slug = raw
        .toString()
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      return `/blog/${slug}/`;
    },
    eleventyExcludeFromCollections(data) {
      return shouldHideInProduction({ date: data.date, draft: data.draft });
    },
  },
};
