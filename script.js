// إنشاء جدول المواد
function generateTable() {
    const numSubjects = parseInt(document.getElementById('numSubjects').value);
    const tableContainer = document.getElementById('tableContainer');

    // تنظيف الجدول السابق
    tableContainer.innerHTML = '';

    if (isNaN(numSubjects) || numSubjects <= 0) {
        alert('يرجى إدخال عدد صحيح للمواد!');
        return;
    }

    // إنشاء الجدول
    const table = document.createElement('table');
    table.className = 'table table-bordered mt-3';
    const header = `
        <thead class="table-primary">
            <tr>
                <th>رقم المادة</th>
                <th>العلامة (%)</th>
            </tr>
        </thead>
    `;
    table.innerHTML = header;

    const tbody = document.createElement('tbody');
    for (let i = 1; i <= numSubjects; i++) {
        const row = `
            <tr>
                <td>${i}</td>
                <td><input type="number" class="form-control grade" min="0" max="100" placeholder="أدخل العلامة"></td>
            </tr>
        `;
        tbody.innerHTML += row;
    }
    table.appendChild(tbody);
    tableContainer.appendChild(table);

    // حفظ عدد المواد
    localStorage.setItem('numSubjects', numSubjects);
}

// حساب المعدل
function calculateAverage() {
    const grades = document.querySelectorAll('.grade');
    let total = 0;
    let count = 0;

    grades.forEach(input => {
        const value = parseFloat(input.value);
        if (!isNaN(value)) {
            total += value;
            count++;
        }
    });

    if (count === 0) {
        alert('يرجى إدخال علامات صحيحة!');
        return;
    }

    const average = total / count;
    const result = document.getElementById('result');
    result.textContent = `المعدل: ${average.toFixed(2)}%`;

    // تغيير لون النتيجة
    result.style.color = average >= 50 ? 'green' : 'red';

    // حفظ النتائج
    localStorage.setItem('average', average.toFixed(2));
}

// إعادة التعيين
function resetFields() {
    document.getElementById('numSubjects').value = '';
    document.getElementById('tableContainer').innerHTML = '';
    document.getElementById('result').textContent = '';
    localStorage.clear();
}

// تصدير النتائج إلى PDF
function exportToPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const resultText = document.getElementById('result').textContent || 'لا توجد نتائج';
    doc.text('نتائج حساب المعدل', 10, 10);
    doc.text(resultText, 10, 20);
    doc.save('results.pdf');
}

// تصدير النتائج إلى Excel
function exportToExcel() {
    const data = [["المادة", "العلامة"]];
    document.querySelectorAll('table tbody tr').forEach((row, index) => {
        const grade = row.querySelector('.grade').value || "0";
        data.push([index + 1, grade]);
    });

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, "Results");
    XLSX.writeFile(wb, "results.xlsx");
}

// تحميل البيانات المخزنة
window.onload = () => {
    const numSubjects = localStorage.getItem('numSubjects');
    const average = localStorage.getItem('average');
    if (numSubjects) {
        document.getElementById('numSubjects').value = numSubjects;
        generateTable();
    }
    if (average) {
        document.getElementById('result').textContent = `المعدل: ${average}%`;
        document.getElementById('result').style.color = average >= 50 ? 'green' : 'red';
    }
};
