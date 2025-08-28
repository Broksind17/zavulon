import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const exportToPDF = async (element: HTMLElement, filename: string) => {
  try {
    // Создаем canvas из HTML элемента
    const canvas = await html2canvas(element, {
      scale: 2, // Увеличиваем качество
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    });

    // Получаем размеры
    const imgWidth = 210; // A4 ширина в мм
    const pageHeight = 295; // A4 высота в мм
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    // Создаем PDF
    const pdf = new jsPDF('p', 'mm', 'a4');
    let position = 0;

    // Добавляем изображение на первую страницу
    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Добавляем дополнительные страницы если нужно
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // Сохраняем файл
    pdf.save(`${filename}.pdf`);
  } catch (error) {
    console.error('Ошибка при экспорте в PDF:', error);
    alert('Ошибка при создании PDF файла');
  }
};
