export default function parseCSV(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const text = reader.result;
        const [headerLine, ...lines] = text.split('\n').map(line => line.trim()).filter(Boolean);
        const headers = headerLine.split(',');
  
        const data = lines.map(line => {
          const values = line.split(',');
          const entry = {};
          headers.forEach((h, i) => (entry[h.trim()] = values[i]?.trim() || ''));
          return entry;
        });
  
        resolve(data);
      };
      reader.onerror = reject;
      reader.readAsText(file);
    });
  }
  