import { Component, HostListener, AfterViewInit, ElementRef } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements AfterViewInit {
  isScrolled = false;
  activeSection: string = '';

  constructor(private el: ElementRef) {}

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.pageYOffset > 0;
    this.updateActiveSectionOnScroll();
  }

  ngAfterViewInit(): void {
    this.updateActiveSectionOnScroll(); 
  }

  scrollToSection(event: Event, sectionId: string): void {
    event.preventDefault();
    const targetElement = document.querySelector(sectionId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
      this.activeSection = sectionId; 
    }
  }

  updateActiveSectionOnScroll(): void {
    const sections = this.el.nativeElement.querySelectorAll('section');
    let currentActiveSection = '';

    sections.forEach((section: HTMLElement) => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
        currentActiveSection = `#${section.id}`;
      }
    });

    if (currentActiveSection && this.activeSection !== currentActiveSection) {
      this.activeSection = currentActiveSection; 
    }
  }
}
