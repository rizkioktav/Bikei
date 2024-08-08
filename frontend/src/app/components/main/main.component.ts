import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit, AfterViewInit {

  showHeaderFooter: boolean = true;

  constructor(private el: ElementRef, private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.showHeaderFooter = !['/login', '/signup'].includes(event.url);
      }
    });
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initFadeInObserver();
    this.initTypeWriterObserver();
  }

  initFadeInObserver(): void {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
          observer.unobserve(entry.target); // Optional: unobserve after animation
        }
      });
    }, options);

    const targets = this.el.nativeElement.querySelectorAll('.animate-on-scroll');
    targets.forEach((target: Element) => observer.observe(target));
  }

  initTypeWriterObserver(): void {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.target.id === 'name') {
          this.typeWriter("RIZKI OKTAVIANUS", 100, "name");
          observer.unobserve(entry.target); // Optional: unobserve after animation
        }
      });
    }, options);

    const target = this.el.nativeElement.querySelector('#name');
    if (target) {
      observer.observe(target);
    }
  }

  typeWriter(text: string, speed: number, elementId: string): void {
    let i = 0;
    const element = document.getElementById(elementId);
    if (element) {
      element.classList.add('typing');
      const type = () => {
        if (i < text.length) {
          element.innerHTML += text.charAt(i);
          i++;
          setTimeout(type, speed);
        } else {
          element.classList.remove('typing');
          element.classList.remove('opacity-0'); // Ensure text is visible after typing animation
        }
      };
      type();
    }
  }
}
