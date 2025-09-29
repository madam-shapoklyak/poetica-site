fetch('library.json')
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById('library');
    Object.entries(data).forEach(([bookName, bookData]) => {
      const bookDiv = document.createElement('div');
      bookDiv.className = 'collection';

      const img = document.createElement('img');
      img.src = bookData.cover !== "нет изображения" ? bookData.cover : 'images/placeholder.jpg';
      img.alt = `Обложка ${bookName}`;
      img.className = 'cover';
      bookDiv.appendChild(img);

      const textBlock = document.createElement('div');
      textBlock.className = 'text-block';

      const title = document.createElement('h3');
      title.textContent = bookName;
      textBlock.appendChild(title);

      if (Object.keys(bookData.sections).length > 0) {
        const ul = document.createElement('ul');
        Object.entries(bookData.sections).forEach(([sectionName, docPath]) => {
          const li = document.createElement('li');
          const link = document.createElement('a');
          link.href = `reader.html?book=${encodeURIComponent(bookName)}&section=${encodeURIComponent(sectionName)}`;
          link.textContent = sectionName;
          li.appendChild(link);
          ul.appendChild(li);
        });
        textBlock.appendChild(ul);
      } else {
        const p = document.createElement('p');
        p.innerHTML = '<em>Разделы пока не добавлены. Сборник в процессе наполнения.</em>';
        textBlock.appendChild(p);
      }

      bookDiv.appendChild(textBlock);
      container.appendChild(bookDiv);
    });
  })
  .catch(error => {
    console.error('Ошибка загрузки library.json:', error);
  });
