(function ()
{
  if (!window.PhotoGalleryGadget)
  {
    window.PhotoGalleryGadget = {};
  }

  PhotoGalleryGadget.PhotoGallery = PhotoGallery;

  function PhotoGallery (gadgetId, numberOfRows, numberOfColumns, marginHorizontal, resolution, sort)
  {
    var pictures = getPictures();
    var sortBy = sort;

    function getPictures ()
    {
      var i,
          pics = [],
          elements,
          container = document.querySelector('DIV[data-componentId="' + gadgetId + '"]');

      if (!container)
      {
        return null;
      }

      elements = container.querySelectorAll('DIV[data-thumb]');

      for (i = 0; i < elements.length; i++)
      {
        pics[i] =
          {
            'thumbnail': elements[i].getAttribute('data-thumb'),
            'origin': elements[i].getAttribute('data-src'),
            'date': 'June.03.2019',
            'name': elements[i].getAttribute('data-src').replace(/.*?\/([^\/]+)$/, '$1')
          };
      }
      return pics;
    }


    pictures.sort(function (a, b)
    {
      var sortA = null,
          sortB = null;

      if (sortBy === "Date")
      {
        sortA = new Date(a.date);
        sortB = new Date(b.date);
      }
      else if (sortBy === "Name")
      {
        sortA = a.name;
        sortB = b.name;
      }

      if (sortA > sortB)
      {
        return 1
      }
      else if (sortA < sortB)
      {
        return -1
      }
      else if (sortA === sortB)
      {
        return 0
      }
    });


    if (pictures)
    {
      new PhotoGalleryGadget.RenderGallery(gadgetId, pictures, numberOfRows, numberOfColumns, marginHorizontal, resolution);
    }
  }

})();